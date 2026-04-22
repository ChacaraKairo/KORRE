import {
  FileText,
  Landmark,
  MapPin,
  Shield,
  Smartphone,
  Wifi,
  X,
} from 'lucide-react-native';
import React, { memo, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTema } from '../../../../hooks/modo_tema';
import {
  REGRAS_IPVA_ESTADOS,
  SiglaEstado,
} from '../../../../type/ipvaEstados';
import { FormularioViabilidade } from '../../../../type/viabilidadeCorrida'; // SSOT
import { AccordionSection } from '../ui/AccordionSection';
import { InputFinanceiro } from '../ui/InputFinanceiro';

interface SecaoCustosExistenciaProps {
  form: Partial<FormularioViabilidade>;
  onChange: (
    campo: keyof FormularioViabilidade,
    valor: string,
  ) => void;
  onHelp: (titulo: string, texto: string) => void;
  onCalcularIPVA: (ufSelecionada?: SiglaEstado) => void; // <-- Permite receber a UF
  isComplete: boolean;
}

export const SecaoCustosExistencia = memo(
  ({
    form,
    onChange,
    onHelp,
    onCalcularIPVA,
    isComplete,
  }: SecaoCustosExistenciaProps) => {
    const { tema } = useTema();
    const isDark = tema === 'escuro';

    // Estado local para controlar a visibilidade do modal de seleção de estado
    const [modalUFVisivel, setModalUFVisivel] =
      useState(false);

    // Extrai as siglas do seu Map de regras para montar a lista do Modal automaticamente
    const listaEstados = Object.keys(
      REGRAS_IPVA_ESTADOS,
    ) as SiglaEstado[];

    // Função disparada ao clicar numa UF dentro do modal
    const handleSelecionarUF = (uf: SiglaEstado) => {
      setModalUFVisivel(false);
      onCalcularIPVA(uf); // Calcula e atualiza imediatamente!
    };

    return (
      <>
        <AccordionSection
          title="Custos de Existência (Tempo)"
          icon={<Landmark size={20} color="#00C853" />}
          isComplete={isComplete}
          onHelpClick={() =>
            onHelp(
              'Custos de Existência',
              'Custos fixos. Eles definem quanto você perde com o carro parado.',
            )
          }
        >
          <View style={{ gap: 12 }}>
            {/* 1. IMPOSTOS E TAXAS */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputFinanceiro
                  label="IPVA Anual"
                  value={String(form.ipva_anual || '')}
                  onChangeText={(v) =>
                    onChange('ipva_anual', v)
                  }
                  placeholder="R$ 0,00"
                  icon={<FileText size={18} color="#666" />}
                  suffix="R$"
                />
              </View>
              {/* Botão que agora abre o Modal */}
              <TouchableOpacity
                style={[
                  styles.autoButton,
                  {
                    backgroundColor: isDark
                      ? '#1A1A1A'
                      : '#F0F0F0',
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => setModalUFVisivel(true)}
              >
                <MapPin size={16} color="#00C853" />
                <Text
                  style={[
                    styles.autoButtonText,
                    { color: isDark ? '#FFF' : '#333' },
                  ]}
                >
                  CALCULAR ({form.estado_uf || 'SP'}) ▾
                </Text>
              </TouchableOpacity>
            </View>

            <InputFinanceiro
              label="Licenciamento / DPVAT"
              value={String(
                form.licenciamento_detran_anual || '',
              )}
              onChangeText={(v) =>
                onChange('licenciamento_detran_anual', v)
              }
              placeholder="R$ 0,00"
              icon={<FileText size={18} color="#666" />}
              suffix="R$/Ano"
            />

            {/* 2. PROTEÇÃO E CONECTIVIDADE */}
            <InputFinanceiro
              label="Seguro Comercial / APP"
              value={String(
                form.seguro_comercial_anual || '',
              )}
              onChangeText={(v) =>
                onChange('seguro_comercial_anual', v)
              }
              placeholder="R$ 0,00"
              icon={<Shield size={18} color="#666" />}
              suffix="R$/Ano"
            />

            <InputFinanceiro
              label="Plano de Dados (Internet)"
              value={String(form.plano_dados_mensal || '')}
              onChangeText={(v) =>
                onChange('plano_dados_mensal', v)
              }
              placeholder="R$ 0,00"
              icon={<Wifi size={18} color="#666" />}
              suffix="R$/Mês"
            />

            {/* 3. EQUIPAMENTO DE TRABALHO */}
            <InputFinanceiro
              label="Custo do Smartphone"
              value={String(form.valor_smartphone || '')}
              onChangeText={(v) =>
                onChange('valor_smartphone', v)
              }
              placeholder="R$ 0,00"
              icon={<Smartphone size={18} color="#666" />}
              suffix="R$"
            />

            <InputFinanceiro
              label="Vida Útil (Meses)"
              value={String(
                form.vida_util_smartphone_meses || '',
              )}
              onChangeText={(v) =>
                onChange('vida_util_smartphone_meses', v)
              }
              placeholder="Ex: 24"
              icon={<Landmark size={18} color="#666" />}
              suffix="Meses"
            />
          </View>
        </AccordionSection>

        {/* Modal de Seleção de Estado (Renderizado fora da Accordion para evitar cortes de layout) */}
        <Modal
          visible={modalUFVisivel}
          transparent
          animationType="fade"
          onRequestClose={() => setModalUFVisivel(false)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: isDark
                    ? '#1E1E1E'
                    : '#FFF',
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: isDark ? '#FFF' : '#333' },
                  ]}
                >
                  Selecione o Estado
                </Text>
                <TouchableOpacity
                  onPress={() => setModalUFVisivel(false)}
                >
                  <X size={24} color="#999" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={listaEstados}
                keyExtractor={(item) => item}
                numColumns={4}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.ufButton,
                      {
                        backgroundColor:
                          form.estado_uf === item
                            ? '#00C853'
                            : isDark
                              ? '#2C2C2C'
                              : '#F5F5F5',
                      },
                    ]}
                    onPress={() => handleSelecionarUF(item)}
                  >
                    <Text
                      style={[
                        styles.ufButtonText,
                        {
                          color:
                            form.estado_uf === item
                              ? '#FFF'
                              : isDark
                                ? '#CCC'
                                : '#555',
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </>
    );
  },
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  autoButton: {
    height: 52,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#00C853',
    marginBottom: 0,
  },
  autoButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '70%',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ufButton: {
    width: '22%', // Cabe 4 colunas com espacamento
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ufButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
