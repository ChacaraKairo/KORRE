import { useRouter } from 'expo-router';
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
import { useHeaderClimaDashboard } from '../../../hooks/dashboard/useHeaderClimaDashboard';
import { dashboardStyles as styles } from '../../../styles/telas/Dashboard/dashboardStyles';

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
  const router = useRouter();
  const { clima, loadingClima } = useHeaderClimaDashboard();

  // Estado para controlar se a imagem falhou
  const [imageError, setImageError] = useState(false);

  // --- LOG 1: O que está chegando no componente? ---
  useEffect(() => {
    console.log(
      '[DEBUG Avatar] Props atualizadas. Valor de fotoPerfil:',
      fotoPerfil,
    );
    setImageError(false); // Tenta recarregar se a prop mudar
  }, [fotoPerfil]);

  // Regra de segurança: impede strings vazias de tentarem renderizar
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
          onPress={() => router.push('/perfil' as any)}
        >
          <View style={styles.avatar}>
            {isFotoValida ? (
              <Image
                source={{ uri: fotoPerfil }}
                style={{
                  width: 48, // <-- OBRIGATÓRIO: Tamanho fixo para não colapsar
                  height: 48, // <-- OBRIGATÓRIO: Tamanho fixo para não colapsar
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0', // Fundo cinza para ver se o espaço existe
                }}
                // --- LOGS DE CICLO DE VIDA DA IMAGEM ---
                onLoadStart={() =>
                  console.log(
                    '[DEBUG Avatar] ⏳ Iniciando download da imagem...',
                  )
                }
                onLoad={() =>
                  console.log(
                    '[DEBUG Avatar] ✅ Imagem carregada e renderizada com sucesso!',
                  )
                }
                onError={(e) => {
                  console.error(
                    '[DEBUG Avatar] ❌ ERRO ao carregar a imagem. Detalhes:',
                    e.nativeEvent.error,
                  );
                  setImageError(true); // Aciona o fallback
                }}
              />
            ) : (
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(0, 200, 83, 0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={24} color="#00C853" />
              </View>
            )}
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={styles.nomeUsuario}
              numberOfLines={1}
            >
              {nome ? nome.split(' ')[0] : 'Motorista'}
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
                style={{ flexShrink: 0, marginTop: 2 }}
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

        {/* Container para alinhar o Clima e as Configurações à direita */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
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
