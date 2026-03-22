// Arquivo: src/components/telas/Cadastro/VeiculoSecao.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Settings, Gauge } from 'lucide-react-native';
import { Input } from '../../ui/inputs/Input';
import { styles } from '../../../styles/telas/Cadastro/componentes/cadastroStyles';
import {
  VEICULOS_CONFIG,
  VEICULOS_LISTA,
  TipoVeiculo,
} from '../../../type/typeVeiculos';

interface VeiculoProps {
  tipo: TipoVeiculo;
  setTipo: (t: TipoVeiculo) => void;
  marca: string;
  setMarca: (t: string) => void;
  modelo: string;
  setModelo: (t: string) => void;
  ano: string;
  setAno: (t: string) => void;
  motor: string;
  setMotor: (t: string) => void;
  placa: string;
  setPlaca: (t: string) => void;
  km: string;
  setKm: (t: string) => void;
  erro: boolean;
}

export const VeiculoSecao: React.FC<VeiculoProps> = ({
  tipo,
  setTipo,
  marca,
  setMarca,
  modelo,
  setModelo,
  ano,
  setAno,
  motor,
  setMotor,
  placa,
  setPlaca,
  km,
  setKm,
  erro,
}) => {
  const configAtual =
    VEICULOS_CONFIG[tipo] || VEICULOS_CONFIG.moto;
  const placeholders = configAtual.placeholders;

  return (
    <View style={styles.card}>
      <View style={localStyles.sectionTitleRow}>
        <Settings size={18} color="#00C853" />
        <Text style={styles.labelSecao}>TUA MÁQUINA</Text>
      </View>

      <View style={localStyles.selectorGrid}>
        {VEICULOS_LISTA.map((vConfig) => {
          const Icone = vConfig.icone;
          const isAtivo = tipo === vConfig.id;
          return (
            <TouchableOpacity
              key={vConfig.id}
              style={[
                localStyles.selectBtn,
                isAtivo && localStyles.selectBtnAtivo,
              ]}
              onPress={() => setTipo(vConfig.id)}
            >
              <Icone
                size={24}
                color={isAtivo ? '#00C853' : '#444'}
              />
              <Text
                style={[
                  localStyles.selectLabel,
                  isAtivo && localStyles.selectLabelAtivo,
                ]}
              >
                {vConfig.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* INPUTS COM EXEMPLOS DINÂMICOS */}
      <View style={localStyles.row}>
        <View style={localStyles.flex1}>
          <Input
            label="Marca"
            placeholder={placeholders.marca}
            value={marca}
            onChangeText={(t) => setMarca(t.toUpperCase())}
            autoCapitalize="characters"
            erro={erro && !marca}
          />
        </View>
        <View style={localStyles.flex1}>
          <Input
            label="Modelo"
            placeholder={placeholders.modelo}
            value={modelo}
            onChangeText={(t) => setModelo(t.toUpperCase())}
            autoCapitalize="characters"
            erro={erro && !modelo}
          />
        </View>
      </View>

      {configAtual.requerMotor && (
        <View style={localStyles.row}>
          <View style={localStyles.flex1}>
            <Input
              label="Ano"
              placeholder="2024"
              value={ano}
              onChangeText={setAno}
              keyboardType="numeric"
            />
          </View>
          <View style={localStyles.flex1}>
            <Input
              label="Motor"
              placeholder={placeholders.motor}
              value={motor}
              onChangeText={(t) =>
                setMotor(t.toUpperCase())
              }
              autoCapitalize="characters"
              erro={erro && !motor}
            />
          </View>
        </View>
      )}

      {configAtual.requerPlaca && (
        <Input
          label="Placa"
          placeholder={placeholders.placa}
          value={placa}
          onChangeText={(t) => setPlaca(t.toUpperCase())}
          autoCapitalize="characters"
          erro={erro && !placa}
        />
      )}

      {configAtual.requerOdometro && (
        <Input
          label="Quilometragem Atual"
          placeholder="Ex: 12500"
          value={km}
          onChangeText={setKm}
          keyboardType="numeric"
          Icone={Gauge}
          erro={erro && !km}
        />
      )}
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
  selectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  selectBtn: {
    flexBasis: '30%',
    flexGrow: 1,
    height: 70,
    backgroundColor: '#202020',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectBtnAtivo: {
    borderColor: '#00C853',
    backgroundColor: 'rgba(0, 200, 83, 0.05)',
  },
  selectLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#444',
    marginTop: 6,
    textTransform: 'uppercase',
  },
  selectLabelAtivo: {
    color: '#00C853',
  },
});
