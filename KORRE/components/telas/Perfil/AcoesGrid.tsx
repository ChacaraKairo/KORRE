import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BarChart3,
  Bell,
  Download,
  HelpCircle,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { styles } from '../../../styles/telas/Perfil/perfilStyles';
import { useTema } from '../../../hooks/modo_tema';
import { useExportarDados } from '../../../hooks/perfil_user/useExportarDados';

export const AcoesGrid = () => {
  const { t } = useTranslation();
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const router = useRouter();

  const { exportarDados, isExportando } =
    useExportarDados();

  const cardStyle = {
    backgroundColor: isDark ? '#161616' : '#FFFFFF',
    borderColor: isDark ? '#222' : '#E0E0E0',
    borderWidth: 1,
  };

  return (
    <View>
      <Text
        style={[
          styles.secaoTitle,
          { color: isDark ? '#FFFFFF' : '#000000' },
        ]}
      >
        {t('perfil.configuracoes')}
      </Text>
      <View style={styles.gridAcoes}>
        <TouchableOpacity
          style={[styles.btnAcao, cardStyle]}
          onPress={() => router.push('/(tabs)/relatorios')}
        >
          <BarChart3 size={24} color="#00C853" />
          <Text
            style={[
              styles.btnAcaoTexto,
              { color: isDark ? '#FFFFFF' : '#000000' },
            ]}
          >
            {t('perfil.relatorios')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnAcao, cardStyle]}
          onPress={() => router.push('/notificacoes')}
        >
          <Bell size={24} color="#00C853" />
          <Text
            style={[
              styles.btnAcaoTexto,
              { color: isDark ? '#FFFFFF' : '#000000' },
            ]}
          >
            {t('perfil.notificacoes')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btnAcao,
            cardStyle,
            { opacity: isExportando ? 0.7 : 1 },
          ]}
          onPress={exportarDados}
          disabled={isExportando}
        >
          {isExportando ? (
            <ActivityIndicator size={24} color="#00C853" />
          ) : (
            <Download size={24} color="#00C853" />
          )}
          <Text
            style={[
              styles.btnAcaoTexto,
              { color: isDark ? '#FFFFFF' : '#000000' },
            ]}
          >
            {isExportando
              ? t('perfil.gerando_exportacao')
              : t('perfil.exportar_dados')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnAcao, cardStyle]}
          onPress={() => router.push('/(tabs)/suporte')}
        >
          <HelpCircle size={24} color="#00C853" />
          <Text
            style={[
              styles.btnAcaoTexto,
              { color: isDark ? '#FFFFFF' : '#000000' },
            ]}
          >
            {t('perfil.ajuda_suporte')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
