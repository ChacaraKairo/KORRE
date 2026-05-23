import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeftRight, Settings2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { inlineStyles } from '../../../styles/generated-inline/components/telas/Perfil/VeiculoResumoInlineStyles';
import { dynamicInlineStyles } from '../../../styles/generated-dynamic/components/telas/Perfil/VeiculoResumoDynamicStyles';
import { styles } from '../../../styles/telas/Perfil/perfilStyles';
import { useTema } from '../../../hooks/modo_tema';
import {
  TipoVeiculo,
  VEICULOS_CONFIG,
} from '../../../type/typeVeiculos';
import type { Veiculo } from '../../../types/database';
import { showCustomAlert } from '../../../hooks/alert/useCustomAlert';

interface Props {
  veiculo: Veiculo | null;
  onTrocarVeiculo?: () => void;
}

export const VeiculoResumo = ({
  veiculo,
  onTrocarVeiculo,
}: Props) => {
  const { t } = useTranslation();
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const router = useRouter();

  return (
    <View style={inlineStyles.inline1}>
      <Text
        style={[
          styles.secaoTitle,
          {
            color: isDark ? '#FFFFFF' : '#000000',
            marginBottom: 8,
          },
        ]}
      >
        {t('perfil.sua_maquina')}
      </Text>

      <View
        style={[
          styles.cardVeiculo,
          {
            backgroundColor: isDark ? '#161616' : '#FFFFFF',
            borderColor: isDark ? '#222' : '#E0E0E0',
            borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12,
            paddingHorizontal: 16,
            marginBottom: 0,
            borderRadius: 20,
          },
        ]}
      >
        <View style={inlineStyles.inline2}>
          <View
            style={[
              styles.veiculoIconBox,
              {
                padding: 10,
                marginRight: 12,
                borderRadius: 12,
              },
            ]}
          >
            {(() => {
              const tipo =
                (veiculo?.tipo as TipoVeiculo) || 'moto';
              const Icone =
                VEICULOS_CONFIG[tipo]?.icone ||
                VEICULOS_CONFIG.moto.icone;
              return <Icone size={20} color="#00C853" />;
            })()}
          </View>

          <View style={inlineStyles.inline3}>
            <Text
              style={[
                styles.veiculoModelo,
                {
                  color: isDark ? '#FFFFFF' : '#000000',
                  fontSize: 14,
                  marginBottom: 2,
                },
              ]}
              numberOfLines={1}
            >
              {veiculo?.modelo || t('perfil.nenhum_veiculo')}
            </Text>
            <Text
              style={[
                styles.veiculoPlaca,
                {
                  color: isDark ? '#888' : '#555',
                  fontSize: 12,
                  marginTop: 0,
                },
              ]}
            >
              {veiculo?.placa || t('perfil.adicione_veiculo')}
            </Text>
          </View>
        </View>

        <View style={inlineStyles.inline4}>
          <TouchableOpacity
            onPress={
              onTrocarVeiculo ||
              (() =>
                showCustomAlert(
                  t('garagem.trocar_veiculo'),
                  t('perfil.abrir_troca_veiculo'),
                ))
            }
            style={dynamicInlineStyles.inline1({ isDark })}
          >
            <ArrowLeftRight
              size={18}
              color={isDark ? '#FFF' : '#333'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/garagem')}
            style={inlineStyles.inline5}
          >
            <Settings2 size={18} color="#00C853" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
