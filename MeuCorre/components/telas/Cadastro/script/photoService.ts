import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export const PhotoService = {
  async takePhoto(
    fotoAntigaUri?: string | null,
  ): Promise<string | null> {
    try {
      const { status } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted')
        throw new Error('Sem permissão de câmera');

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (
        !result.canceled &&
        result.assets &&
        result.assets.length > 0
      ) {
        const tempUri = result.assets[0].uri;

        // Tenta o Document, se falhar tenta o Cache (que é garantido no Mobile)
        const baseDir =
          FileSystem.documentDirectory ||
          FileSystem.cacheDirectory;

        if (!baseDir) {
          throw new Error(
            'O sistema de arquivos retornou vazio. Tente reiniciar o Expo Go.',
          );
        }

        const fileName = `profile_${Date.now()}.jpg`;
        const destPath = `${baseDir}${fileName}`;

        // Copia o arquivo
        await FileSystem.copyAsync({
          from: tempUri,
          to: destPath,
        });

        // Deleta antiga se existir
        if (
          fotoAntigaUri &&
          fotoAntigaUri.startsWith('file://')
        ) {
          const info =
            await FileSystem.getInfoAsync(fotoAntigaUri);
          if (info.exists) {
            await FileSystem.deleteAsync(
              fotoAntigaUri,
            ).catch(() => {});
          }
        }

        return destPath;
      }
      return null;
    } catch (error) {
      console.error('Erro no PhotoService:', error);
      throw error;
    }
  },
};
