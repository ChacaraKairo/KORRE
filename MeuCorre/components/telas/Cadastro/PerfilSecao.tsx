// Arquivo: src/components/telas/Cadastro/PerfilSecao.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { User, Camera, X, Lock } from 'lucide-react-native';
import { Input } from '../../ui/inputs/Input';
import { styles } from '../../../styles/telas/Cadastro/componentes/cadastroStyles';
import { PhotoService } from './script/photoService';
import { showCustomAlert } from '../../../hooks/alert/useCustomAlert';

interface PerfilProps {
  nome: string;
  setNome: (t: string) => void;
  senha: string;
  setSenha: (t: string) => void;
  foto: string | null;
  setFoto: (uri: string | null) => void;
  erro: boolean;
}

export const PerfilSecao: React.FC<PerfilProps> = ({
  nome,
  setNome,
  senha,
  setSenha,
  foto,
  setFoto,
  erro,
}) => {
  const handleTakeAction = async () => {
    try {
      // Passamos a 'foto' atual para que o PhotoService possa excluir o arquivo antigo
      const savedUri = await PhotoService.takePhoto(foto);
      if (savedUri) {
        setFoto(savedUri);
      }
    } catch (error: any) {
      showCustomAlert(
        'Erro',
        error.message ||
          'Não foi possível capturar a foto.',
      );
    }
  };

  const handleRemovePhoto = async () => {
    // Opcional: Você pode chamar uma função no PhotoService para deletar o arquivo físico aqui também
    setFoto(null);
  };

  return (
    <View style={styles.card}>
      <View style={localStyles.sectionTitleRow}>
        <User size={18} color="#00C853" />
        <Text style={styles.labelSecao}>
          DADOS DO PILOTO
        </Text>
      </View>

      <View style={localStyles.photoContainer}>
        <View style={localStyles.avatarWrapper}>
          <TouchableOpacity
            style={localStyles.avatar}
            onPress={handleTakeAction}
            activeOpacity={0.8}
          >
            {foto ? (
              <Image
                source={{ uri: foto }}
                style={localStyles.avatarImg}
                key={foto} // Força o refresh da imagem se o URI mudar
              />
            ) : (
              <User size={40} color="#252525" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={localStyles.btnSmallCamera}
            onPress={handleTakeAction}
          >
            <Camera size={14} color="#0A0A0A" />
          </TouchableOpacity>

          {foto && (
            <TouchableOpacity
              style={localStyles.btnRemovePhoto}
              onPress={handleRemovePhoto}
            >
              <X size={14} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Input
        label="Nome de Usuário"
        placeholder="Ex: João Silva"
        value={nome}
        onChangeText={(t) => setNome(t.toUpperCase())}
        autoCapitalize="characters"
        Icone={User}
        erro={erro && nome.length < 3}
      />

      <Input
        label="Senha de Acesso"
        placeholder="••••••••"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        Icone={Lock}
        erro={erro && senha.length < 4}
      />
    </View>
  );
};

// ... (os localStyles permanecem os mesmos)
const localStyles = StyleSheet.create({
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  photoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginVertical: 10,
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#00C853',
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  btnSmallCamera: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00C853',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#161616',
  },
  btnRemovePhoto: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#161616',
  },
});
