import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Camera, User, Pencil } from 'lucide-react-native';
import { styles } from '../../../styles/telas/Perfil/perfilStyles';
import { useTema } from '../../../hooks/modo_tema';
import type { PerfilUsuario } from '../../../types/database';

import { dynamicInlineStyles } from '../../../styles/generated-dynamic/components/telas/Perfil/CardUsuarioDynamicStyles';
interface Props {
  usuario: PerfilUsuario | null;
  onEditPress: () => void;
  onCameraPress?: () => void;
}

export const CardUsuario = ({
  usuario,
  onEditPress,
  onCameraPress, // <-- Recebe a função aqui
}: Props) => {
  const { t } = useTranslation();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  return (
    <View
      style={[
        styles.cardPerfil,
        {
          backgroundColor: isDark ? '#161616' : '#FFFFFF',
          borderColor: isDark ? '#222' : '#E0E0E0',
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.avatarContainer}>
        {/* Adicionei o onPress aqui na bolinha da foto caso ele clique nela toda */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onCameraPress}
          style={[
            styles.avatar,
            {
              backgroundColor: isDark
                ? '#0A0A0A'
                : '#F5F5F5',
            },
          ]}
        >
          {usuario?.foto_uri ? (
            <Image
              source={{ uri: usuario.foto_uri }}
              style={dynamicInlineStyles.inline1({})}
            />
          ) : (
            <User
              size={40}
              color={isDark ? '#666' : '#999'}
            />
          )}
        </TouchableOpacity>

        {/* E adicionei o onPress no ícone verde da câmara */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onCameraPress}
          style={[
            styles.avatarBadge,
            { backgroundColor: '#00C853' },
          ]}
        >
          <Camera
            size={14}
            color="#0A0A0A"
            strokeWidth={3}
          />
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.nomeUsuario,
          { color: isDark ? '#FFFFFF' : '#000000' },
        ]}
      >
        {usuario?.nome || t('perfil.piloto')}
      </Text>
      <View style={styles.tagEntregador}>
        <Text style={styles.tagTexto}>
          {t('perfil.entregador_parceiro')}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.btnEditarPerfil}
        onPress={onEditPress}
      >
        <Pencil size={14} color="#00C853" />
        <Text style={styles.btnEditarTexto}>
          {t('perfil.editar_dados')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
