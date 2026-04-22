// Arquivo: src/components/telas/Cadastro/MetasSecao.tsx
// Componente: MetasSecao - Seleção de Meta Diária ou Semanal

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Target,
  Clock,
  CalendarDays,
} from 'lucide-react-native';
import { Input } from '../../ui/inputs/Input';
import { styles as cadastroStyles } from '../../../styles/telas/Cadastro/componentes/cadastroStyles';

interface MetasSecaoProps {
  meta: string;
  setMeta: (t: string) => void;
  tipoMeta: 'diaria' | 'semanal';
  setTipoMeta: (t: 'diaria' | 'semanal') => void;
  erro: boolean;
}

/**
 * Este componente permite que o piloto escolha entre uma meta de faturamento
 * diária ou semanal, alterando os placeholders e ícones dinamicamente.
 */
export const MetasSecao: React.FC<MetasSecaoProps> = ({
  meta,
  setMeta,
  tipoMeta,
  setTipoMeta,
  erro,
}) => {
  return (
    <View style={cadastroStyles.card}>
      <View style={localStyles.sectionTitleRow}>
        <Target size={18} color="#00C853" />
        <Text style={cadastroStyles.labelSecao}>
          METAS E SEGURANÇA
        </Text>
      </View>

      {/* SELETOR DE PERÍODO (TOGGLE) */}
      <View style={localStyles.toggleContainer}>
        <TouchableOpacity
          style={[
            localStyles.toggleBtn,
            tipoMeta === 'diaria' &&
              localStyles.toggleBtnActive,
          ]}
          onPress={() => setTipoMeta('diaria')}
          activeOpacity={0.8}
        >
          <Clock
            size={16}
            color={
              tipoMeta === 'diaria' ? '#0A0A0A' : '#666'
            }
          />
          <Text
            style={[
              localStyles.toggleText,
              tipoMeta === 'diaria' &&
                localStyles.toggleTextActive,
            ]}
          >
            Diária
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            localStyles.toggleBtn,
            tipoMeta === 'semanal' &&
              localStyles.toggleBtnActive,
          ]}
          onPress={() => setTipoMeta('semanal')}
          activeOpacity={0.8}
        >
          <CalendarDays
            size={16}
            color={
              tipoMeta === 'semanal' ? '#0A0A0A' : '#666'
            }
          />
          <Text
            style={[
              localStyles.toggleText,
              tipoMeta === 'semanal' &&
                localStyles.toggleTextActive,
            ]}
          >
            Semanal
          </Text>
        </TouchableOpacity>
      </View>

      <Input
        label={
          tipoMeta === 'diaria'
            ? 'Meta Diária (R$)'
            : 'Meta Semanal (R$)'
        }
        placeholder={
          tipoMeta === 'diaria'
            ? 'Ex: 150.00'
            : 'Ex: 800.00'
        }
        value={meta}
        onChangeText={setMeta}
        keyboardType="numeric"
        Icone={tipoMeta === 'diaria' ? Clock : CalendarDays}
        erro={erro && !meta}
      />

      <Text style={localStyles.obsText}>
        {tipoMeta === 'diaria'
          ? '* Esta meta será usada para calcular o seu progresso diário.'
          : '* A meta semanal ajuda no planejamento financeiro de longo prazo.'}
      </Text>
    </View>
  );
};

const localStyles = StyleSheet.create({
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 12,
  },
  toggleBtnActive: {
    backgroundColor: '#00C853',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
  },
  toggleTextActive: {
    color: '#0A0A0A',
  },
  obsText: {
    fontSize: 10,
    color: '#444',
    marginTop: -8,
    marginLeft: 4,
    fontStyle: 'italic',
  },
});
