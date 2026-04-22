import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

export const PhotoService = {
  // Mantemos o mesmo nome da função principal para não quebrar a sua tela
  async takePhoto(
    fotoAntigaUri?: string | null,
  ): Promise<string | null> {
    return new Promise((resolve, reject) => {
      Alert.alert(
        'Foto de Perfil',
        'Escolha de onde quer pegar a foto:',
        [
          {
            text: 'Câmera',
            onPress: async () => {
              try {
                const uri =
                  await this.abrirCamera(fotoAntigaUri);
                resolve(uri);
              } catch (e) {
                reject(e);
              }
            },
          },
          {
            text: 'Galeria',
            onPress: async () => {
              try {
                const uri =
                  await this.abrirGaleria(fotoAntigaUri);
                resolve(uri);
              } catch (e) {
                reject(e);
              }
            },
          },
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => resolve(null),
          },
        ],
        { cancelable: true },
      );
    });
  },

  // 1. Função isolada para abrir a CÂMERA (Frontal)
  async abrirCamera(
    fotoAntigaUri?: string | null,
  ): Promise<string | null> {
    const { status } =
      await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Sem permissão de câmera');
    }

    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front, // <-- Força a câmera frontal
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    return this.processarESalvarArquivo(
      result,
      fotoAntigaUri,
    );
  },

  // 2. Função isolada para abrir a GALERIA
  async abrirGaleria(
    fotoAntigaUri?: string | null,
  ): Promise<string | null> {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error(
        'Sem permissão para acessar a galeria',
      );
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Aceita apenas imagens
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

    return this.processarESalvarArquivo(
      result,
      fotoAntigaUri,
    );
  },

  // 3. Lógica central para salvar no celular e apagar a foto antiga (Reaproveitada)
  async processarESalvarArquivo(
    result: ImagePicker.ImagePickerResult,
    fotoAntigaUri?: string | null,
  ): Promise<string | null> {
    if (
      !result.canceled &&
      result.assets &&
      result.assets.length > 0
    ) {
      const tempUri = result.assets[0].uri;
      const baseDir = FileSystem.documentDirectory;

      if (!baseDir) {
        return tempUri;
      }

      const fileName = `profile_${Date.now()}.jpg`;
      const destPath = `${baseDir}${fileName}`;

      await FileSystem.copyAsync({
        from: tempUri,
        to: destPath,
      });

      if (
        fotoAntigaUri &&
        fotoAntigaUri.startsWith('file://')
      ) {
        const info =
          await FileSystem.getInfoAsync(fotoAntigaUri);
        if (info.exists) {
          await FileSystem.deleteAsync(fotoAntigaUri).catch(
            () => {},
          );
        }
      }

      return destPath;
    }

    return null; // Caso o usuário feche a câmera/galeria sem escolher nada
  },
};
