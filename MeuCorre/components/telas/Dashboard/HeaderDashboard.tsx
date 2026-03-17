import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Zap,
  Settings,
  User,
  Sun,
  Cloud,
  CloudRain,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { dashboardStyles as styles } from '../../../styles/telas/Dashboard/dashboardStyles';
import { useHeaderClimaDashboard } from '../../../hooks/dashboard/useHeaderClimaDashboard';

interface HeaderProps {
  nome: string;
  fraseMotivacional: string;
  fotoPerfil?: string | null;
  onPressConfig?: () => void; // Nova prop para funcionalidade do botão
}

export const HeaderDashboard: React.FC<HeaderProps> = ({
  nome,
  fraseMotivacional,
  fotoPerfil,
  onPressConfig,
}) => {
  const router = useRouter();
  const { clima, loadingClima } = useHeaderClimaDashboard();

  return (
    <View style={styles.header}>
      <View style={styles.perfilContainer}>
        <TouchableOpacity
          style={styles.infoUsuario}
          activeOpacity={0.7}
          onPress={() => router.push('/perfil' as any)}
        >
          {/* Avatar com suporte a foto local ou fallback */}
          <View style={styles.avatar}>
            {fotoPerfil ? (
              <Image
                source={{ uri: fotoPerfil }}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 24,
                }}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={24} color="#00C853" />
              </View>
            )}
          </View>

          <View>
            {/* Nome com peso 900 conforme a nova identidade */}
            <Text style={styles.nomeUsuario}>
              {nome.split(' ')[0]}
            </Text>
            <View style={styles.tagMotivacional}>
              <Zap
                size={10}
                color="#00C853"
                fill="#00C853"
              />
              {/* Esta frase agora virá do frasesService via Dashboard.tsx */}
              <Text style={styles.textoMotivacional}>
                {fraseMotivacional}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Container para alinhar o Clima e as Configurações à direita */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Widget de Previsão do Tempo para Amanhã */}
          {!loadingClima && clima && (
            <View
              style={{
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: '#888',
                  fontSize: 8,
                  fontWeight: 'bold',
                  marginBottom: 2,
                  textTransform: 'uppercase',
                }}
              >
                Previsão de Amanhã
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {clima.condicao === 'sol' && (
                  <Sun size={16} color="#FFEB3B" />
                )}
                {clima.condicao === 'nublado' && (
                  <Cloud size={16} color="#9E9E9E" />
                )}
                {clima.condicao === 'chuva' && (
                  <CloudRain size={16} color="#03A9F4" />
                )}
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: 11,
                    fontWeight: '900',
                  }}
                >
                  {clima.max}° / {clima.min}°
                </Text>
              </View>
              {clima.condicao === 'chuva' &&
                clima.horaChuva && (
                  <Text
                    style={{
                      color: '#03A9F4',
                      fontSize: 9,
                      fontWeight: 'bold',
                      marginTop: 2,
                    }}
                  >
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
