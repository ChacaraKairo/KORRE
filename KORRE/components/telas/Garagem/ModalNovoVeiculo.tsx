// Arquivo: src/components/telas/Garagem/ModalNovoVeiculo.tsx
import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  Settings,
  Gauge,
  Check,
  ChevronDown,
  Search,
} from 'lucide-react-native';
import { useTema } from '../../../hooks/modo_tema';
import { Input } from '../../ui/inputs/Input';
import {
  TipoVeiculo,
  VEICULOS_CONFIG,
  VEICULOS_LISTA,
} from '../../../type/typeVeiculos';
import {
  VEICULOS_DATABASE,
  TipoVeiculoKey,
} from '../../../type/veiculosData';
import { showCustomAlert } from '../../../hooks/alert/useCustomAlert';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (veiculo: any) => Promise<void>;
}

export const ModalNovoVeiculo = ({
  visible,
  onClose,
  onSave,
}: Props) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  // Estados do Veículo
  const [tipo, setTipo] = useState<TipoVeiculo>('moto');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [motor, setMotor] = useState('');
  const [placa, setPlaca] = useState('');
  const [kmAtual, setKmAtual] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Estados para o Pop-up interno de seleção (mesma lógica do Cadastro)
  const [popVisivel, setPopVisivel] = useState(false);
  const [popConfig, setPopConfig] = useState({
    titulo: '',
    valorAtual: '',
    sugestoes: [] as string[],
    aoSalvar: (val: string) => {},
  });

  // Geração de Listas Dinâmicas
  const listaAnos = useMemo(() => {
    const atual = new Date().getFullYear();
    const anos = [];
    for (let i = atual; i >= 1980; i--)
      anos.push(i.toString());
    return anos;
  }, []);

  const marcasDisponiveis = useMemo(() => {
    return Object.keys(
      VEICULOS_DATABASE[tipo as TipoVeiculoKey] || {},
    );
  }, [tipo]);

  const modelosDisponiveis = useMemo(() => {
    const subGrupo = (
      VEICULOS_DATABASE[tipo as TipoVeiculoKey] as any
    )?.[marca];
    return subGrupo ? Object.keys(subGrupo) : [];
  }, [tipo, marca]);

  const motoresDisponiveis = useMemo(() => {
    return (
      (VEICULOS_DATABASE[tipo as TipoVeiculoKey] as any)?.[
        marca
      ]?.[modelo] || []
    );
  }, [tipo, marca, modelo]);

  const abrirSeletor = (
    titulo: string,
    valor: string,
    lista: string[],
    acao: (v: string) => void,
  ) => {
    setPopConfig({
      titulo,
      valorAtual: valor,
      sugestoes: lista,
      aoSalvar: acao,
    });
    setPopVisivel(true);
  };

  const handleSalvar = async () => {
    const config = VEICULOS_CONFIG[tipo];
    if (
      !marca ||
      !modelo ||
      (config.requerPlaca && !placa) ||
      (config.requerOdometro && !kmAtual)
    ) {
      showCustomAlert(
        'Erro',
        'Por favor, preencha os campos obrigatórios para esta categoria.',
      );
      return;
    }

    setSalvando(true);
    try {
      await onSave({
        tipo,
        marca,
        modelo,
        ano,
        motor,
        placa: placa.toUpperCase(),
        km_atual: parseInt(kmAtual.replace(/\D/g, '')) || 0,
      });
      limparCampos();
      onClose();
    } catch (error) {
      console.error(
        '[ModalNovoVeiculo] Erro ao salvar:',
        error,
      );
    } finally {
      setSalvando(false);
    }
  };

  const limparCampos = () => {
    setTipo('moto');
    setMarca('');
    setModelo('');
    setAno('');
    setMotor('');
    setPlaca('');
    setKmAtual('');
  };

  const labelMotor =
    tipo === 'bicicleta'
      ? 'Versão'
      : tipo === 'carro_eletrico'
        ? 'Modelo'
        : 'Motor';
  const labelMarca =
    tipo === 'carro_eletrico' ? 'Categoria' : 'Marca';
  const labelModelo =
    tipo === 'carro_eletrico' ? 'Marca' : 'Modelo';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={localStyles.overlay}>
        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios' ? 'padding' : undefined
          }
          style={localStyles.container}
        >
          <View
            style={[
              localStyles.content,
              {
                backgroundColor: isDark
                  ? '#0A0A0A'
                  : '#F5F5F5',
              },
            ]}
          >
            {/* Header */}
            <View
              style={[
                localStyles.header,
                {
                  borderBottomColor: isDark
                    ? '#222'
                    : '#E0E0E0',
                },
              ]}
            >
              <TouchableOpacity
                onPress={onClose}
                style={localStyles.btnClose}
              >
                <X size={20} color="#666" />
              </TouchableOpacity>
              <Text style={localStyles.title}>
                NOVA MÁQUINA
              </Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 20 }}
            >
              {/* Seletor de Tipo */}
              <View style={localStyles.gridTipos}>
                {VEICULOS_LISTA.map((v) => {
                  const Icone = v.icone;
                  const isAtivo = tipo === v.id;
                  return (
                    <TouchableOpacity
                      key={v.id}
                      onPress={() => {
                        setTipo(v.id);
                        setMarca('');
                        setModelo('');
                        setMotor('');
                      }}
                      style={[
                        localStyles.btnTipo,
                        isAtivo && localStyles.btnTipoAtivo,
                        {
                          backgroundColor: isDark
                            ? '#161616'
                            : '#FFF',
                        },
                      ]}
                    >
                      <Icone
                        size={24}
                        color={isAtivo ? '#00C853' : '#444'}
                      />
                      <Text
                        style={[
                          localStyles.txtTipo,
                          {
                            color: isAtivo
                              ? '#00C853'
                              : '#666',
                          },
                        ]}
                      >
                        {v.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Campos de Seleção */}
              <View style={localStyles.row}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    abrirSeletor(
                      labelMarca,
                      marca,
                      marcasDisponiveis,
                      (v) => {
                        setMarca(v);
                        setModelo('');
                        setMotor('');
                      },
                    )
                  }
                >
                  <View pointerEvents="none">
                    <Input
                      label={labelMarca}
                      value={marca}
                      placeholder="Selecionar"
                      Icone={ChevronDown}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  disabled={!marca}
                  onPress={() =>
                    abrirSeletor(
                      labelModelo,
                      modelo,
                      modelosDisponiveis,
                      (v) => {
                        setModelo(v);
                        setMotor('');
                      },
                    )
                  }
                >
                  <View pointerEvents="none">
                    <Input
                      label={labelModelo}
                      value={modelo}
                      placeholder="Selecionar"
                      Icone={ChevronDown}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={localStyles.row}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    abrirSeletor(
                      'Ano',
                      ano,
                      listaAnos,
                      setAno,
                    )
                  }
                >
                  <View pointerEvents="none">
                    <Input
                      label="Ano"
                      value={ano}
                      placeholder="2026"
                      Icone={ChevronDown}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  disabled={!modelo}
                  onPress={() =>
                    abrirSeletor(
                      labelMotor,
                      motor,
                      motoresDisponiveis,
                      setMotor,
                    )
                  }
                >
                  <View pointerEvents="none">
                    <Input
                      label={labelMotor}
                      value={motor}
                      placeholder="Selecionar"
                      Icone={ChevronDown}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Placa e KM */}
              {VEICULOS_CONFIG[tipo].requerPlaca && (
                <Input
                  label="Placa"
                  value={placa}
                  onChangeText={setPlaca}
                  placeholder="ABC1D23"
                  autoCapitalize="characters"
                />
              )}
              {VEICULOS_CONFIG[tipo].requerOdometro && (
                <Input
                  label="KM Atual"
                  value={kmAtual}
                  onChangeText={setKmAtual}
                  placeholder="Ex: 12500"
                  keyboardType="numeric"
                  Icone={Gauge}
                />
              )}

              <TouchableOpacity
                onPress={handleSalvar}
                disabled={salvando}
                style={localStyles.btnSave}
              >
                {salvando ? (
                  <ActivityIndicator color="#0A0A0A" />
                ) : (
                  <>
                    <Check
                      size={20}
                      color="#0A0A0A"
                      strokeWidth={3}
                    />
                    <Text style={localStyles.btnSaveText}>
                      ADICIONAR À GARAGEM
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>

        {/* POP-UP INTERNO DE SELEÇÃO (Reutilizando a lógica do Cadastro) */}
        <Modal
          visible={popVisivel}
          animationType="slide"
          transparent
        >
          <KeyboardAvoidingView
            behavior={
              Platform.OS === 'ios' ? 'padding' : 'height'
            }
            style={localStyles.popOverlay}
          >
            <View style={localStyles.popContent}>
              <View style={localStyles.popHeader}>
                <Text style={localStyles.popTitle}>
                  {popConfig.titulo}
                </Text>
                <TouchableOpacity
                  onPress={() => setPopVisivel(false)}
                >
                  <X color="#666" size={24} />
                </TouchableOpacity>
              </View>
              <Input
                label={`Digite ou selecione`}
                value={popConfig.valorAtual}
                onChangeText={(t) =>
                  setPopConfig({
                    ...popConfig,
                    valorAtual: t.toUpperCase(),
                  })
                }
                autoFocus
                Icone={Search}
              />
              <ScrollView
                style={{ flex: 1, marginTop: 10 }}
                keyboardShouldPersistTaps="handled"
              >
                {popConfig.sugestoes.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={localStyles.popItem}
                    onPress={() => {
                      popConfig.aoSalvar(item);
                      setPopVisivel(false);
                    }}
                  >
                    <Text style={{ color: '#EEE' }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
                {popConfig.valorAtual !== '' &&
                  !popConfig.sugestoes.includes(
                    popConfig.valorAtual,
                  ) && (
                    <TouchableOpacity
                      style={[
                        localStyles.popItem,
                        {
                          borderColor: '#00C853',
                          borderWidth: 1,
                        },
                      ]}
                      onPress={() => {
                        popConfig.aoSalvar(
                          popConfig.valorAtual,
                        );
                        setPopVisivel(false);
                      }}
                    >
                      <Text style={{ color: '#00C853' }}>
                        Usar: "{popConfig.valorAtual}"
                      </Text>
                    </TouchableOpacity>
                  )}
              </ScrollView>
              <TouchableOpacity
                style={localStyles.popConfirmBtn}
                onPress={() => {
                  popConfig.aoSalvar(popConfig.valorAtual);
                  setPopVisivel(false);
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>
                  CONFIRMAR
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  container: { height: '85%' },
  content: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  btnClose: {
    padding: 8,
    backgroundColor: '#222',
    borderRadius: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    color: '#00C853',
    letterSpacing: 1,
  },
  gridTipos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  btnTipo: {
    flex: 1,
    minWidth: '45%',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  btnTipoAtivo: {
    borderColor: '#00C853',
    backgroundColor: 'rgba(0,200,83,0.05)',
  },
  txtTipo: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
    textTransform: 'uppercase',
  },
  row: { flexDirection: 'row', gap: 12 },
  btnSave: {
    backgroundColor: '#00C853',
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  btnSaveText: { fontWeight: '900', color: '#0A0A0A' },
  // Pop-up Styles
  popOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
  },
  popContent: {
    backgroundColor: '#161616',
    height: '70%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  popHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  popTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  popItem: {
    padding: 16,
    backgroundColor: '#222',
    borderRadius: 12,
    marginBottom: 8,
  },
  popConfirmBtn: {
    backgroundColor: '#00C853',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
});
