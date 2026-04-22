import React from 'react';
import { View, Text } from 'react-native';
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { styles } from '../../../styles/telas/Relatorios/carneLeaoStyles';

interface Props {
  pago: boolean;
  impostoDevido: number;
}

export function ImpostoCard({
  pago,
  impostoDevido,
}: Props) {
  return (
    <View
      style={[
        styles.impostoCard,
        pago
          ? styles.impostoCardPago
          : styles.impostoCardPendente,
      ]}
    >
      {/* Background icon */}
      <View style={styles.impostoCardBgIcon}>
        <MaterialCommunityIcons
          name="shield-check"
          size={120}
          color={pago ? '#00C853' : '#2196F3'}
        />
      </View>

      <View style={styles.impostoCardContent}>
        <View style={styles.impostoLabelRow}>
          <FontAwesome5
            name="receipt"
            size={12}
            color={pago ? '#00C853' : '#2196F3'}
          />
          <Text style={styles.impostoLabel}>
            Imposto a Pagar (DARF)
          </Text>
        </View>

        <Text style={styles.impostoValue}>
          R${' '}
          {impostoDevido.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
          })}
        </Text>

        <View style={styles.impostoStatusRow}>
          {pago ? (
            <View style={styles.badgePago}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color="#0A0A0A"
              />
              <Text style={styles.badgePagoText}>
                Quitado
              </Text>
            </View>
          ) : (
            <View style={styles.badgePendente}>
              <Ionicons
                name="alert-circle"
                size={14}
                color="#F59E0B"
              />
              <Text style={styles.badgePendenteText}>
                Aguardando Pagamento
              </Text>
            </View>
          )}
          <Text style={styles.vencimento}>
            Vencimento: 10/03/2026
          </Text>
        </View>
      </View>
    </View>
  );
}
