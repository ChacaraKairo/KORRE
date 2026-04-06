// Arquivo: src/components/telas/Cadastro/VeiculoSecao.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Settings,
  Gauge,
  ChevronDown,
  Search,
  X,
} from 'lucide-react-native';
import { Input } from '../../ui/inputs/Input';
import { styles } from '../../../styles/telas/Cadastro/componentes/cadastroStyles';
import {
  VEICULOS_CONFIG,
  VEICULOS_LISTA,
  TipoVeiculo,
} from '../../../type/typeVeiculos';
import {
  VEICULOS_DATABASE,
  TipoVeiculoKey,
} from '../../../type/veiculosData';

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

  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    titulo: '',
    valorAtual: '',
    sugestoes: [] as string[],
    aoSalvar: (val: string) => {},
  });

  const listaAnos = useMemo(() => {
    const atual = new Date().getFullYear();
    const anos = [];
    for (let i = atual; i >= 1980; i--)
      anos.push(i.toString());
    return anos;
  }, []);

  const abrirPopUp = (
    titulo: string,
    valor: string,
    lista: string[],
    acao: (v: string) => void,
  ) => {
    setModalConfig({
      titulo,
      valorAtual: valor,
      sugestoes: lista,
      aoSalvar: acao,
    });
    setModalVisivel(true);
  };

  // --- LÓGICA DE LISTAS DINÂMICAS ADAPTADA PARA NOVA ESTRUTURA ---

  const marcas = useMemo(() => {
    const databaseDoTipo =
      VEICULOS_DATABASE[tipo as TipoVeiculoKey];
    return databaseDoTipo
      ? Object.keys(databaseDoTipo)
      : [];
  }, [tipo]);

  const modelos = useMemo(() => {
    const databaseDoTipo =
      VEICULOS_DATABASE[tipo as TipoVeiculoKey];
    if (databaseDoTipo && marca) {
      const subGrupo = (databaseDoTipo as any)[marca];
      return subGrupo ? Object.keys(subGrupo) : [];
    }
    return [];
  }, [tipo, marca]);

  const motores = useMemo(() => {
    const databaseDoTipo =
      VEICULOS_DATABASE[tipo as TipoVeiculoKey];
    if (databaseDoTipo && marca && modelo) {
      return (databaseDoTipo as any)[marca]?.[modelo] || [];
    }
    return [];
  }, [tipo, marca, modelo]);

  // Labels dinâmicos para a categoria Elétrico
  const labelMarca =
    (tipo as TipoVeiculoKey) === 'eletrico'
      ? 'Categoria'
      : 'Marca';
  const labelModelo =
    (tipo as TipoVeiculoKey) === 'eletrico'
      ? 'Marca'
      : 'Modelo';
  const labelMotor =
    (tipo as TipoVeiculoKey) === 'bicicleta'
      ? 'Versão'
      : (tipo as TipoVeiculoKey) === 'eletrico'
        ? 'Modelo'
        : 'Motor';

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
              onPress={() => {
                setTipo(vConfig.id);
                setMarca('');
                setModelo('');
                setMotor('');
              }}
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

      <View style={localStyles.row}>
        <TouchableOpacity
          style={localStyles.flex1}
          onPress={() =>
            abrirPopUp(labelMarca, marca, marcas, (v) => {
              setMarca(v);
              setModelo('');
              setMotor('');
            })
          }
        >
          <View pointerEvents="none">
            <Input
              label={labelMarca}
              value={marca}
              placeholder="Selecionar"
              Icone={ChevronDown}
              erro={erro && !marca}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={localStyles.flex1}
          onPress={() =>
            abrirPopUp(
              labelModelo,
              modelo,
              modelos,
              (v) => {
                setModelo(v);
                setMotor('');
              },
            )
          }
          disabled={marcas.length > 0 && !marca}
        >
          <View pointerEvents="none">
            <Input
              label={labelModelo}
              value={modelo}
              placeholder={
                marca ? 'Selecionar' : 'Escolha anterior'
              }
              Icone={ChevronDown}
              erro={erro && !modelo}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={localStyles.row}>
        <TouchableOpacity
          style={localStyles.flex1}
          onPress={() =>
            abrirPopUp('Ano', ano, listaAnos, setAno)
          }
        >
          <View pointerEvents="none">
            <Input
              label="Ano"
              value={ano}
              placeholder="2026"
              Icone={ChevronDown}
              erro={erro && !ano}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={localStyles.flex1}
          onPress={() =>
            abrirPopUp(labelMotor, motor, motores, setMotor)
          }
          disabled={modelos.length > 0 && !modelo}
        >
          <View pointerEvents="none">
            <Input
              label={labelMotor}
              value={motor}
              placeholder={
                modelo ? 'Selecionar' : 'Escolha anterior'
              }
              Icone={ChevronDown}
              erro={erro && !motor}
            />
          </View>
        </TouchableOpacity>
      </View>

      {configAtual.requerPlaca && (
        <Input
          label="Placa"
          value={placa}
          onChangeText={(t) => setPlaca(t.toUpperCase())}
          placeholder="ABC1D23"
          autoCapitalize="characters"
          erro={erro && !placa}
        />
      )}
      {configAtual.requerOdometro && (
        <Input
          label="KM Atual"
          value={km}
          onChangeText={(t) => setKm(t.replace(/\D/g, ''))}
          placeholder="12500"
          keyboardType="numeric"
          Icone={Gauge}
          erro={erro && !km}
        />
      )}

      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent={true}
      >
        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios' ? 'padding' : 'height'
          }
          style={localStyles.modalOverlay}
        >
          <View style={localStyles.modalContent}>
            <View style={localStyles.modalHeader}>
              <Text style={localStyles.modalTitle}>
                {modalConfig.titulo}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisivel(false)}
              >
                <X color="#666" size={24} />
              </TouchableOpacity>
            </View>

            <Input
              label={`Digite ou selecione o ${modalConfig.titulo}`}
              value={modalConfig.valorAtual}
              onChangeText={(t) =>
                setModalConfig({
                  ...modalConfig,
                  valorAtual: t.toUpperCase(),
                })
              }
              autoFocus={true}
              Icone={Search}
            />

            <Text style={localStyles.sugestaoLabel}>
              Lista de Opções:
            </Text>
            <ScrollView
              style={localStyles.modalScroll}
              keyboardShouldPersistTaps="handled"
            >
              {modalConfig.sugestoes.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={localStyles.itemLista}
                  onPress={() => {
                    modalConfig.aoSalvar(item);
                    setModalVisivel(false);
                  }}
                >
                  <Text style={localStyles.itemListaText}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}

              {modalConfig.valorAtual !== '' &&
                !modalConfig.sugestoes.includes(
                  modalConfig.valorAtual,
                ) && (
                  <TouchableOpacity
                    style={[
                      localStyles.itemLista,
                      {
                        borderColor: '#00C853',
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => {
                      modalConfig.aoSalvar(
                        modalConfig.valorAtual,
                      );
                      setModalVisivel(false);
                    }}
                  >
                    <Text
                      style={[
                        localStyles.itemListaText,
                        { color: '#00C853' },
                      ]}
                    >
                      Usar: "{modalConfig.valorAtual}"
                    </Text>
                  </TouchableOpacity>
                )}
            </ScrollView>

            <TouchableOpacity
              style={localStyles.btnConfirmar}
              onPress={() => {
                modalConfig.aoSalvar(
                  modalConfig.valorAtual,
                );
                setModalVisivel(false);
              }}
            >
              <Text style={localStyles.btnConfirmarText}>
                CONFIRMAR
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  flex1: { flex: 1 },
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
  selectLabelAtivo: { color: '#00C853' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#161616',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    height: '80%',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sugestaoLabel: {
    color: '#666',
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 10,
  },
  modalScroll: { flex: 1 },
  itemLista: {
    padding: 16,
    backgroundColor: '#222',
    borderRadius: 12,
    marginBottom: 8,
  },
  itemListaText: { color: '#EEE', fontSize: 16 },
  btnConfirmar: {
    backgroundColor: '#00C853',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  btnConfirmarText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
