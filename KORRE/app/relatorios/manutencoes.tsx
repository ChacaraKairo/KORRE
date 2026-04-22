import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  ArrowLeft,
  Share2,
  Calendar,
  CarFront,
  Wrench,
  Image as ImageIcon,
  FileText,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import ViewShot from 'react-native-view-shot';

// Hooks & Estilos
import { useTema } from '../../hooks/modo_tema';
import { useManutencoesReport } from '../../hooks/relatorios/useManutencoesReport';
import { styles } from '../../styles/telas/Relatorios/manutencoesStyles';

export default function ManutencoesReportScreen() {
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const {
    periodo,
    periodos,
    veiculos,
    veiculoSelecionado,
    veiculoSelecionadoId,
    dadosAgrupados,
    totalGasto,
    totalServicos,
    modalShare,
    setModalShare,
    modalFiltroVeiculo,
    setModalFiltroVeiculo,
    modalFiltroPeriodo,
    setModalFiltroPeriodo,
    ocultarValores,
    setOcultarValores,
    viewShotRef,
    partilharPrint,
    trocarVeiculo,
    trocarPeriodo,
    layoutParaPrint,
  } = useManutencoesReport();

  // Cores Temáticas
  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#888' : '#666';

  const formatarMoeda = (valor: number) => {
    if (ocultarValores) return 'R$ ***';
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: bgColor },
      ]}
    >
      {/* HEADER EXCLUÍDO DO PRINT */}
      <View
        style={[
          styles.header,
          { borderBottomColor: borderColor },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.btnVoltar,
            { backgroundColor: cardColor, borderColor },
          ]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={textColor} />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: textColor }]}
        >
          Relatório de Oficina
        </Text>
        <TouchableOpacity
          style={styles.btnShare}
          onPress={() => setModalShare(true)}
        >
          <Share2 size={20} color="#00C853" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FILTROS EXCLUÍDOS DO PRINT */}
        <View style={styles.filtrosContainer}>
          <TouchableOpacity
            style={[
              styles.filtroBotao,
              { backgroundColor: cardColor, borderColor },
            ]}
            onPress={() => setModalFiltroVeiculo(true)}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <CarFront size={18} color={textMuted} />
              <Text
                style={[
                  styles.filtroTexto,
                  { color: textColor },
                ]}
              >
                {veiculoSelecionado}
              </Text>
            </View>
            <Text
              style={{
                color: '#00C853',
                fontSize: 12,
                fontWeight: 'bold',
              }}
            >
              Trocar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filtroBotao,
              { backgroundColor: cardColor, borderColor },
            ]}
            onPress={() => setModalFiltroPeriodo(true)}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Calendar size={18} color={textMuted} />
              <Text
                style={[
                  styles.filtroTexto,
                  { color: textColor },
                ]}
              >
                {periodo}
              </Text>
            </View>
            <Text
              style={{
                color: '#00C853',
                fontSize: 12,
                fontWeight: 'bold',
              }}
            >
              Trocar
            </Text>
          </TouchableOpacity>
        </View>

        {/* === MAIN CONTENT === */}
        <View
          style={{
            backgroundColor: bgColor,
            paddingVertical: 10,
          }}
        >
          {/* RESUMO TOTAL */}
          <View
            style={[
              styles.cardResumo,
              { backgroundColor: '#00C853' },
            ]}
          >
            <Text
              style={[
                styles.resumoLabel,
                { color: '#0A0A0A' },
              ]}
            >
              Custo Total no Período
            </Text>
            <Text
              style={[
                styles.resumoValor,
                { color: '#0A0A0A' },
              ]}
            >
              {formatarMoeda(totalGasto)}
            </Text>
            <View style={styles.resumoRodape}>
              <Wrench size={14} color="#FFF" />
              <Text style={styles.resumoRodapeTexto}>
                {totalServicos} Serviços Realizados
              </Text>
            </View>
          </View>

          {/* LISTA AGRUPADA */}
          <Text
            style={[
              styles.sectionTitle,
              { color: textColor },
            ]}
          >
            Serviços Detalhados
          </Text>

          {dadosAgrupados.length === 0 ? (
            <View
              style={{ padding: 20, alignItems: 'center' }}
            >
              <Text
                style={{
                  color: textMuted,
                  textAlign: 'center',
                }}
              >
                Nenhum serviço registado para este veículo.
              </Text>
            </View>
          ) : (
            dadosAgrupados.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.itemCard,
                  {
                    backgroundColor: cardColor,
                    borderColor,
                  },
                ]}
              >
                <View
                  style={[
                    styles.itemIconBox,
                    {
                      backgroundColor: isDark
                        ? '#222'
                        : '#F5F5F5',
                    },
                  ]}
                >
                  <Wrench size={24} color={textMuted} />
                </View>

                <View style={styles.itemContent}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={[
                        styles.itemTitle,
                        { color: textColor },
                      ]}
                    >
                      {item.nome}
                    </Text>
                    <View style={styles.itemQtdBadge}>
                      <Text style={styles.itemQtdTexto}>
                        {item.quantidade}x
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.itemStats,
                      { color: textMuted },
                    ]}
                  >
                    Média: {formatarMoeda(item.valorMedio)}{' '}
                    por serviço
                  </Text>
                </View>

                <Text
                  style={[
                    styles.itemTotal,
                    {
                      color: ocultarValores
                        ? textMuted
                        : '#EF4444',
                    },
                  ]}
                >
                  {formatarMoeda(item.valorTotal)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* MODAL DE PARTILHA */}
      <Modal
        visible={modalShare}
        transparent
        animationType="slide"
        onRequestClose={() => setModalShare(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: cardColor, borderColor },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: textColor },
              ]}
            >
              Exportar Relatório
            </Text>
            <Text
              style={[
                styles.modalDesc,
                { color: textMuted },
              ]}
            >
              Crie uma imagem bonita deste relatório para
              partilhar.
            </Text>

            {/* TOGGLE OCULTAR VALORES */}
            <View
              style={[
                styles.toggleContainer,
                {
                  backgroundColor: isDark
                    ? '#222'
                    : '#F5F5F5',
                  borderColor,
                },
              ]}
            >
              <View>
                <Text
                  style={[
                    styles.toggleText,
                    { color: textColor },
                  ]}
                >
                  Modo Privacidade
                </Text>
                <Text
                  style={{
                    color: textMuted,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  Esconde os preços (ex: R$ ***)
                </Text>
              </View>
              <Switch
                value={ocultarValores}
                onValueChange={setOcultarValores}
                trackColor={{
                  false: '#767577',
                  true: 'rgba(0, 200, 83, 0.5)',
                }}
                thumbColor={
                  ocultarValores ? '#00C853' : '#f4f3f4'
                }
              />
            </View>

            {/* OPÇÕES DE EXPORTAÇÃO */}
            <TouchableOpacity
              style={[
                styles.btnAcao,
                { backgroundColor: '#00C853' },
              ]}
              onPress={() =>
                partilharPrint('redes_sociais')
              }
            >
              <ImageIcon size={20} color="#0A0A0A" />
              <Text
                style={[
                  styles.btnAcaoTexto,
                  { color: '#0A0A0A' },
                ]}
              >
                Partilhar nas Redes / Grupos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btnAcao,
                {
                  backgroundColor: isDark
                    ? '#333'
                    : '#E0E0E0',
                },
              ]}
              onPress={() => partilharPrint('mecanico')}
            >
              <FileText size={20} color={textColor} />
              <Text
                style={[
                  styles.btnAcaoTexto,
                  { color: textColor },
                ]}
              >
                Gerar Ficha para o Mecânico
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={() => setModalShare(false)}
            >
              <Text
                style={{
                  color: textMuted,
                  fontWeight: 'bold',
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL VEÍCULOS */}
      <Modal
        visible={modalFiltroVeiculo}
        transparent
        animationType="fade"
        onRequestClose={() => setModalFiltroVeiculo(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: cardColor, borderColor },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: textColor },
              ]}
            >
              Selecione o Veículo
            </Text>
            {veiculos.map((v) => (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.btnAcao,
                  {
                    backgroundColor: isDark
                      ? '#333'
                      : '#E0E0E0',
                    borderColor:
                      veiculoSelecionadoId === v.id
                        ? '#00C853'
                        : 'transparent',
                    borderWidth: 1,
                  },
                ]}
                onPress={() => trocarVeiculo(v.id)}
              >
                <Text
                  style={[
                    styles.btnAcaoTexto,
                    { color: textColor },
                  ]}
                >
                  {v.modelo} - {v.placa}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={() => setModalFiltroVeiculo(false)}
            >
              <Text
                style={{
                  color: textMuted,
                  fontWeight: 'bold',
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL PERÍODO */}
      <Modal
        visible={modalFiltroPeriodo}
        transparent
        animationType="fade"
        onRequestClose={() => setModalFiltroPeriodo(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: cardColor, borderColor },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: textColor },
              ]}
            >
              Selecione o Período
            </Text>
            {periodos.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[
                  styles.btnAcao,
                  {
                    backgroundColor: isDark
                      ? '#333'
                      : '#E0E0E0',
                    borderColor:
                      periodo === p.nome
                        ? '#00C853'
                        : 'transparent',
                    borderWidth: 1,
                  },
                ]}
                onPress={() => trocarPeriodo(p)}
              >
                <Text
                  style={[
                    styles.btnAcaoTexto,
                    { color: textColor },
                  ]}
                >
                  {p.nome}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={() => setModalFiltroPeriodo(false)}
            >
              <Text
                style={{
                  color: textMuted,
                  fontWeight: 'bold',
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL DE RENDERIZAÇÃO DO PRINT (Escondido do usuário, ou exibido como "A gerar...") */}
      <Modal
        visible={layoutParaPrint !== 'none'}
        transparent
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.85)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            size="large"
            color="#00C853"
            style={{ marginBottom: 20 }}
          />
          <Text
            style={{ color: '#FFF', fontWeight: 'bold' }}
          >
            Preparando o teu relatório...
          </Text>

          {/* ViewShot posicionado de forma oculta para não poluir a tela do usuário */}
          <View
            style={{
              position: 'absolute',
              // Jogamos o modal para fora da tela em vez de opacity 0.
              // Isso garante que o motor do Android desenhe as Logos perfeitamente!
              left: -10000,
              top: -10000,
            }}
          >
            <ViewShot
              ref={viewShotRef}
              options={{ format: 'png', quality: 1 }}
              style={{
                width: 400,
                backgroundColor:
                  layoutParaPrint === 'mecanico'
                    ? '#FFFFFF'
                    : '#0A0A0A',
                padding: 32,
              }}
            >
              {/* LAYOUT REDES SOCIAIS */}
              {layoutParaPrint === 'social' && (
                <View style={{ gap: 20 }}>
                  <View style={{ alignItems: 'center' }}>
                    <Image
                      source={require('../../assets/images/android-icon-monochrome.png')}
                      style={{
                        width: 180,
                        height: 60,
                        resizeMode: 'contain',
                        tintColor: '#00C853',
                      }}
                    />
                    <Text
                      style={{
                        color: '#FFF',
                        fontSize: 16,
                        textTransform: 'uppercase',
                        letterSpacing: 3,
                        marginTop: 4,
                      }}
                    >
                      Relatório de Cuidados
                    </Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: '#161616',
                      padding: 24,
                      borderRadius: 20,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: '#333',
                    }}
                  >
                    <Text
                      style={{
                        color: '#00C853',
                        fontSize: 26,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}
                    >
                      Motorista de Excelência!
                    </Text>
                    <Text
                      style={{
                        color: '#AAA',
                        fontSize: 16,
                        textAlign: 'center',
                        marginTop: 12,
                        lineHeight: 24,
                      }}
                    >
                      O veículo{' '}
                      <Text
                        style={{
                          color: '#FFF',
                          fontWeight: 'bold',
                        }}
                      >
                        {veiculoSelecionado}
                      </Text>{' '}
                      está em ótimas mãos.
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: '#161616',
                        padding: 20,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#333',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: '#888',
                          fontSize: 14,
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                        }}
                      >
                        Investimento
                      </Text>
                      <Text
                        style={{
                          color: '#FFF',
                          fontSize: 24,
                          fontWeight: '900',
                          marginTop: 8,
                        }}
                      >
                        {formatarMoeda(totalGasto)}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: '#161616',
                        padding: 20,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#333',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: '#888',
                          fontSize: 14,
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                        }}
                      >
                        Serviços Feitos
                      </Text>
                      <Text
                        style={{
                          color: '#00C853',
                          fontSize: 24,
                          fontWeight: '900',
                          marginTop: 8,
                        }}
                      >
                        {totalServicos}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: '#161616',
                      padding: 20,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: '#333',
                    }}
                  >
                    <Text
                      style={{
                        color: '#FFF',
                        fontWeight: '900',
                        marginBottom: 16,
                        fontSize: 16,
                      }}
                    >
                      Últimos Cuidados Realizados:
                    </Text>
                    {dadosAgrupados
                      .slice(0, 6)
                      .map((item) => (
                        <View
                          key={item.id}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 12,
                          }}
                        >
                          <Wrench
                            size={16}
                            color="#00C853"
                            style={{ marginRight: 12 }}
                          />
                          <Text
                            style={{
                              color: '#DDD',
                              flex: 1,
                              fontSize: 16,
                            }}
                          >
                            {item.nome}
                          </Text>
                          <View
                            style={{
                              backgroundColor:
                                'rgba(0,200,83,0.1)',
                              paddingHorizontal: 10,
                              paddingVertical: 4,
                              borderRadius: 8,
                            }}
                          >
                            <Text
                              style={{
                                color: '#00C853',
                                fontWeight: '900',
                              }}
                            >
                              {item.quantidade}x
                            </Text>
                          </View>
                        </View>
                      ))}
                  </View>

                  <View
                    style={{
                      alignItems: 'center',
                      marginTop: 12,
                      borderTopWidth: 1,
                      borderTopColor: '#222',
                      paddingTop: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: '#555',
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      BAIXE O APP MEUCORRE E TENHA O
                      CONTROLO DA TUA MÁQUINA
                    </Text>
                  </View>
                </View>
              )}

              {/* LAYOUT PLANILHA PARA MECÂNICO */}
              {layoutParaPrint === 'mecanico' && (
                <View style={{ gap: 20 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottomWidth: 3,
                      borderBottomColor: '#000',
                      paddingBottom: 20,
                    }}
                  >
                    <View>
                      <Image
                        source={require('../../assets/images/android-icon-monochrome.png')}
                        style={{
                          width: 140,
                          height: 45,
                          resizeMode: 'contain',
                          tintColor: '#000000',
                        }}
                      />
                      <Text
                        style={{
                          color: '#555',
                          fontSize: 14,
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                        }}
                      >
                        Ficha Técnica de Oficina
                      </Text>
                    </View>
                    <View
                      style={{ alignItems: 'flex-end' }}
                    >
                      <Text
                        style={{
                          color: '#000',
                          fontWeight: '900',
                          fontSize: 18,
                        }}
                      >
                        {veiculoSelecionado}
                      </Text>
                      <Text
                        style={{
                          color: '#555',
                          fontSize: 12,
                          marginTop: 4,
                        }}
                      >
                        Período: {periodo}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: '#F5F5F5',
                      padding: 16,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: '#EEE',
                    }}
                  >
                    <Text
                      style={{
                        color: '#000',
                        fontWeight: '900',
                        fontSize: 16,
                        marginBottom: 4,
                      }}
                    >
                      Resumo do Histórico:
                    </Text>
                    <Text
                      style={{
                        color: '#333',
                        fontSize: 14,
                      }}
                    >
                      Foram registados{' '}
                      <Text style={{ fontWeight: 'bold' }}>
                        {totalServicos} procedimentos
                      </Text>{' '}
                      de manutenção para este veículo no
                      período selecionado.
                    </Text>
                  </View>

                  <View style={{ marginTop: 8 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: '#000',
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        style={{
                          flex: 2,
                          fontWeight: 'bold',
                          color: '#FFF',
                          fontSize: 14,
                        }}
                      >
                        Serviço Realizado
                      </Text>
                      <Text
                        style={{
                          flex: 1.5,
                          fontWeight: 'bold',
                          color: '#FFF',
                          textAlign: 'center',
                          fontSize: 14,
                        }}
                      >
                        Última Troca
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          fontWeight: 'bold',
                          color: '#FFF',
                          textAlign: 'center',
                          fontSize: 14,
                        }}
                      >
                        Frequência
                      </Text>
                    </View>

                    {dadosAgrupados.map((item, index) => (
                      <View
                        key={item.id}
                        style={{
                          flexDirection: 'row',
                          paddingVertical: 12,
                          paddingHorizontal: 12,
                          backgroundColor:
                            index % 2 === 0
                              ? '#FFF'
                              : '#F9F9F9',
                          borderBottomWidth: 1,
                          borderBottomColor: '#EEE',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            flex: 2,
                            color: '#000',
                            fontSize: 14,
                            fontWeight: '500',
                          }}
                        >
                          {item.nome}
                        </Text>
                        <Text
                          style={{
                            flex: 1.5,
                            color: '#555',
                            textAlign: 'center',
                            fontSize: 12,
                          }}
                        >
                          {item.ultimaData}
                        </Text>
                        <Text
                          style={{
                            flex: 1,
                            color: '#000',
                            textAlign: 'center',
                            fontWeight: '900',
                            fontSize: 14,
                          }}
                        >
                          {item.quantidade}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View
                    style={{
                      marginTop: 40,
                      borderTopWidth: 1,
                      borderTopColor: '#CCC',
                      paddingTop: 20,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: '#888',
                        fontSize: 10,
                        fontWeight: 'bold',
                      }}
                    >
                      DOCUMENTO GERADO DE FORMA AUTOMÁTICA
                      PELO APLICATIVO MEUCORRE
                    </Text>
                  </View>
                </View>
              )}
            </ViewShot>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
