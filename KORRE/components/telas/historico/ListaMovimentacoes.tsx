import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Clock,
  Briefcase,
  AlertCircle,
} from 'lucide-react-native';
import { useTema } from '../../../hooks/modo_tema';
import { styles } from '../../../styles/telas/Historico/historicoStyles';

interface ListaProps {
  movimentacoes: any[];
  onSelect: (item: any) => void;
}

export function ListaMovimentacoes({
  movimentacoes,
  onSelect,
}: ListaProps) {
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#888' : '#666';

  if (!movimentacoes || movimentacoes.length === 0)
    return null;

  return (
    <View style={{ paddingBottom: 20 }}>
      {movimentacoes.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.itemCard,
            { backgroundColor: cardColor, borderColor },
          ]}
          activeOpacity={0.7}
          onPress={() => onSelect(item)}
        >
          <View style={styles.itemLeft}>
            <View
              style={[
                styles.itemIconBox,
                { backgroundColor: `${item.cor}20` },
              ]}
            >
              {item.tipo === 'ganho' ? (
                <Briefcase size={20} color={item.cor} />
              ) : (
                <AlertCircle size={20} color={item.cor} />
              )}
            </View>
            <View>
              <Text
                style={[
                  styles.itemTitle,
                  { color: textColor },
                ]}
              >
                {item.categoria}
              </Text>
              <View style={styles.itemDataBox}>
                <Clock size={10} color={textMuted} />
                <Text
                  style={[
                    styles.itemDataText,
                    { color: textMuted },
                  ]}
                >
                  {item.data}
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={[
              styles.itemValor,
              {
                color:
                  item.tipo === 'ganho'
                    ? '#00C853'
                    : '#EF4444',
              },
            ]}
          >
            {item.tipo === 'ganho' ? '+' : '-'} R${' '}
            {item.valor.toFixed(2)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
