import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import {
  Cloud,
  CloudRain,
  Settings,
  Sun,
  User,
  Zap,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHeaderClimaDashboard } from '../../../hooks/dashboard/useHeaderClimaDashboard';
import { dashboardStyles as styles } from '../../../styles/telas/Dashboard/dashboardStyles';

import { inlineStyles } from '../../../styles/generated-inline/components/telas/Dashboard/HeaderDashboardInlineStyles';
import { dynamicInlineStyles } from '../../../styles/generated-dynamic/components/telas/Dashboard/HeaderDashboardDynamicStyles';

interface HeaderProps {
  nome: string;
  fraseMotivacional: string;
  fotoPerfil?: string | null;
  onPressConfig?: () => void;
}

export const HeaderDashboard: React.FC<HeaderProps> = ({
  nome,
  fraseMotivacional,
  fotoPerfil,
  onPressConfig,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { clima, loadingClima } = useHeaderClimaDashboard();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let ativo = true;

    const validarFotoLocal = async () => {
      setImageError(false);

      if (!fotoPerfil?.startsWith('file://')) return;

      const info = await FileSystem.getInfoAsync(fotoPerfil);
      if (ativo && !info.exists) {
        console.warn(
          '[Avatar] Arquivo de foto não encontrado. Usando avatar padrão.',
        );
        setImageError(true);
      }
    };

    validarFotoLocal().catch(() => {
      if (ativo) setImageError(true);
    });

    return () => {
      ativo = false;
    };
  }, [fotoPerfil]);

  const isFotoValida =
    fotoPerfil && fotoPerfil.trim() !== '' && !imageError;

  return (
    <View style={styles.header}>
      <View style={styles.perfilContainer}>
        <TouchableOpacity
          style={[
            styles.infoUsuario,
            { flex: 1, paddingRight: 12 },
          ]}
          activeOpacity={0.7}
          onPress={() => router.push('/(tabs)/perfil')}
        >
          <View style={styles.avatar}>
            {isFotoValida ? (
              <Image
                source={{ uri: fotoPerfil }}
                style={dynamicInlineStyles.inline1({})}
                onError={(e) => {
                  console.warn(
                    '[Avatar] Falha ao carregar foto. Usando avatar padrão.',
                    e.nativeEvent.error,
                  );
                  setImageError(true);
                }}
              />
            ) : (
              <View style={inlineStyles.inline1}>
                <User size={24} color="#00C853" />
              </View>
            )}
          </View>

          <View style={inlineStyles.inline2}>
            <Text
              style={styles.nomeUsuario}
              numberOfLines={1}
            >
              {nome ? nome.split(' ')[0] : t('dashboard.motorista')}
            </Text>
            <View
              style={[
                styles.tagMotivacional,
                { alignItems: 'flex-start' },
              ]}
            >
              <Zap
                size={10}
                color="#00C853"
                fill="#00C853"
                style={inlineStyles.inline3}
              />
              <Text
                style={[
                  styles.textoMotivacional,
                  { flex: 1, flexWrap: 'wrap' },
                ]}
              >
                {fraseMotivacional}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={inlineStyles.inline4}>
          {!loadingClima && clima && (
            <View style={inlineStyles.inline5}>
              <Text style={inlineStyles.inline6}>
                {t('dashboard.previsao_amanha')}
              </Text>
              <View style={inlineStyles.inline7}>
                {clima.condicao === 'sol' && (
                  <Sun size={16} color="#FFEB3B" />
                )}
                {clima.condicao === 'nublado' && (
                  <Cloud size={16} color="#9E9E9E" />
                )}
                {clima.condicao === 'chuva' && (
                  <CloudRain size={16} color="#03A9F4" />
                )}
                <Text style={inlineStyles.inline8}>
                  {clima.max}° / {clima.min}°
                </Text>
              </View>
              {clima.condicao === 'chuva' &&
                clima.horaChuva && (
                  <Text style={inlineStyles.inline9}>
                    {clima.horaChuva} (
                    {clima.probabilidadeChuva}%)
                  </Text>
                )}
            </View>
          )}

          <TouchableOpacity
            style={styles.btnConfig}
            activeOpacity={0.7}
            onPress={onPressConfig}
          >
            <Settings size={20} color="#444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
