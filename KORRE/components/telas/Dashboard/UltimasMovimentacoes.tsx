import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { dashboardStyles as styles } from '../../../styles/telas/Dashboard/dashboardStyles';
import { useTema } from '../../../hooks/modo_tema';

interface Movimentacao {
  id: number;
  tipo: 'ganho' | 'despesa';
  valor: number;
  categoria: string;
  hora: string;
}

export const UltimasMovimentacoes = ({
  dados,
}: {
  dados: Movimentacao[];
}) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const router = useRouter();

  return (
    <View style={{ marginTop: 24, paddingBottom: 100 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Clock size={16} color="#00C853" />
          <Text
            style={[
              styles.labelSecaoNegrito,
              { color: isDark ? '#FFF' : '#000' },
            ]}
          >
            ÚLTIMOS REGISTOS
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push('/historico')}
        >
          <Text style={styles.btnVerTudo}>Ver Tudo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerLista}>
        {dados.length === 0 ? (
          <Text
            style={[
              styles.textoVazio,
              { color: isDark ? '#888' : '#555' },
            ]}
          >
            Nenhum registo hoje.
          </Text>
        ) : (
          dados.map((item) => (
            <View
              key={item.id}
              style={[
                styles.itemMovimentacao,
                {
                  backgroundColor: isDark
                    ? '#161616'
                    : '#FFFFFF',
                  borderColor: isDark ? '#222' : '#E0E0E0',
                  borderWidth: 1,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <View
                  style={[
                    styles.miniBadgeIcone,
                    item.tipo === 'ganho'
                      ? styles.bgVerdeTrans
                      : styles.bgVermelhoTrans,
                  ]}
                >
                  {item.tipo === 'ganho' ? (
                    <TrendingUp size={16} color="#00C853" />
                  ) : (
                    <TrendingDown
                      size={16}
                      color="#F44336"
                    />
                  )}
                </View>
                <View>
                  <Text
                    style={[
                      styles.txtCategoria,
                      { color: isDark ? '#FFF' : '#000' },
                    ]}
                  >
                    {item.categoria}
                  </Text>
                  <Text
                    style={[
                      styles.txtHora,
                      { color: isDark ? '#666' : '#888' },
                    ]}
                  >
                    {item.hora}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.txtValorItem,
                  item.tipo === 'ganho'
                    ? styles.colorVerde
                    : styles.colorVermelho,
                ]}
              >
                {item.tipo === 'ganho' ? '+' : '-'} R${' '}
                {item.valor.toFixed(2)}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
};
