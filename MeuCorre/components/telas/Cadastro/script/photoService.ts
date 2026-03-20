import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export const PhotoService = {
  async takePhoto(
    fotoAntigaUri?: string | null,
  ): Promise<string | null> {
    try {
      // 1. Pedir permissão
      const { status } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Sem permissão de câmera');
      }

      // 2. Abrir câmara
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true, // Permite cortar a foto
        aspect: [1, 1], // Quadrado, ideal para perfil
        quality: 0.7, // Comprime a foto para poupar espaço
      });

      if (
        !result.canceled &&
        result.assets &&
        result.assets.length > 0
      ) {
        const tempUri = result.assets[0].uri;

        // 3. Definir o local de destino (DocumentDirectory é o ideal)
        const baseDir = FileSystem.documentDirectory;

        if (!baseDir) {
          return tempUri; // Fallback se der erro no FileSystem
        }

        const fileName = `profile_${Date.now()}.jpg`;
        const destPath = `${baseDir}${fileName}`;

        // 4. Mover a foto da cache temporária para a pasta segura da App
        await FileSystem.copyAsync({
          from: tempUri,
          to: destPath,
        });

        // 5. Apagar a foto antiga para não encher a memória do telemóvel!
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
