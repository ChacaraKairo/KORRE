import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  Calendar,
  CarFront,
  Trophy,
  Smartphone,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { PieChart } from 'react-native-chart-kit';

// Hooks & Estilos
import { useTema } from '../../hooks/modo_tema';
import { useReceitaPlataforma } from '../../hooks/relatorios/useReceitaPlataforma';
import { styles } from '../../styles/telas/Relatorios/receitaPlataformaStyles';

export default function ReceitaPlataformaScreen() {
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const {
    loading,
    periodos,
    periodoObj,
    veiculosLista,
    veiculoObj,
    plataformas,
    totalReceita,
    modalPeriodo,
    setModalPeriodo,
    modalVeiculo,
    setModalVeiculo,
    trocarPeriodo,
    trocarVeiculo,
  } = useReceitaPlataforma();

  // Cores Temáticas
  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const textMuted = isDark ? '#888' : '#666';

  const formatarMoeda = (valor: number) => {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  // Encontrar a plataforma campeã para destacar
  const plataformaTop1 =
    plataformas.length > 0
      ? plataformas.reduce((prev, current) =>
          prev.valor > current.valor ? prev : current,
        )
      : null;

  const screenWidth = Dimensions.get('window').width;

  const chartData = plataformas.map((p) => {
    const isUber = p.nome.toLowerCase().includes('uber');
    const color = isUber
      ? isDark
        ? '#FFFFFF'
        : '#000000'
      : p.corBarra;
    return {
      name: p.nome,
      valor: p.valor,
      color: color,
      legendFontColor: textMuted,
      legendFontSize: 12,
    };
  });

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: bgColor },
      ]}
    >
      {/* HEADER */}
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
          Receita por Plataforma
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* BARRAS DE FILTRO RÁPIDO */}
        <View style={styles.filtrosContainer}>
          <TouchableOpacity
            style={[
              styles.filtroBotao,
              { backgroundColor: cardColor, borderColor },
            ]}
            onPress={() => setModalPeriodo(true)}
          >
            <Calendar size={16} color={textMuted} />
            <Text
              style={[
                styles.filtroTexto,
                { color: textColor },
              ]}
            >
              {periodoObj.nome}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filtroBotao,
              { backgroundColor: cardColor, borderColor },
            ]}
            onPress={() => setModalVeiculo(true)}
          >
            <CarFront size={16} color={textMuted} />
            <Text
              style={[
                styles.filtroTexto,
                { color: textColor },
              ]}
              numberOfLines={1}
            >
              {veiculoObj.nome}
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#00C853"
            style={{ marginTop: 50 }}
          />
        ) : (
          <>
            {/* CARTÃO TOTAL */}
            <View
              style={[
                styles.cardTotal,
                { backgroundColor: cardColor, borderColor },
              ]}
            >
              <Text
                style={[
                  styles.labelTotal,
                  { color: textMuted },
                ]}
              >
                Total Faturado no Período
              </Text>
              <Text
                style={[
                  styles.valorTotal,
                  { color: textColor },
                ]}
              >
                {formatarMoeda(totalReceita)}
              </Text>

              {plataformaTop1 && (
                <View
                  style={[
                    styles.badgeTotal,
                    {
                      backgroundColor:
                        'rgba(0, 200, 83, 0.1)',
                    },
                  ]}
                >
                  <Trophy size={16} color="#00C853" />
                  <Text
                    style={[
                      styles.badgeTexto,
                      { color: '#00C853' },
                    ]}
                  >
                    {plataformaTop1.nome} é a mais rentável!
                  </Text>
                </View>
              )}
            </View>

            {/* GRÁFICO DE PIZZA */}
            {plataformas.length > 0 && (
              <View
                style={{
                  alignItems: 'center',
                  marginBottom: 24,
                  backgroundColor: cardColor,
                  borderRadius: 24,
                  paddingVertical: 16,
                  borderWidth: 1,
                  borderColor,
                }}
              >
                <Text
                  style={{
                    color: textColor,
                    fontWeight: 'bold',
                    marginBottom: 8,
                  }}
                >
                  Distribuição de Ganhos
                </Text>
                <PieChart
                  data={chartData}
                  width={screenWidth - 40}
                  height={200}
                  chartConfig={{
                    color: (opacity = 1) => textColor,
                  }}
                  accessor="valor"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>
            )}

            {/* LISTA DE PLATAFORMAS (COM GRÁFICO NATIVO) */}
            <Text
              style={[
                styles.sectionTitle,
                { color: textColor },
              ]}
            >
              Detalhamento por App
            </Text>

            {plataformas.length === 0 ? (
              <View
                style={{
                  padding: 20,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: textMuted,
                    textAlign: 'center',
                  }}
                >
                  Nenhum rendimento registado para este
                  filtro.
                </Text>
              </View>
            ) : (
              plataformas.map((plat) => {
                // Ajuste específico para a cor da Uber consoante o tema
                const isUber = plat.nome
                  .toLowerCase()
                  .includes('uber');
                const corApp = isUber
                  ? isDark
                    ? '#FFF'
                    : '#000'
                  : plat.corBarra;

                return (
                  <View
                    key={plat.id}
                    style={[
                      styles.plataformaCard,
                      {
                        backgroundColor: cardColor,
                        borderColor,
                      },
                    ]}
                  >
                    {/* Cabeçalho do Card */}
                    <View style={styles.plataformaHeader}>
                      <View style={styles.plataformaInfo}>
                        <View
                          style={[
                            styles.iconeCaixa,
                            {
                              backgroundColor: isDark
                                ? '#222'
                                : '#F5F5F5',
                            },
                          ]}
                        >
                          <Smartphone
                            size={20}
                            color={corApp}
                          />
                        </View>
                        <View>
                          <Text
                            style={[
                              styles.plataformaNome,
                              { color: textColor },
                            ]}
                          >
                            {plat.nome}
                          </Text>
                          <Text
                            style={[
                              styles.plataformaPercentual,
                              { color: textMuted },
                            ]}
                          >
                            Representa {plat.percentual}% do
                            total
                          </Text>
                          <Text
                            style={{
                              color: textMuted,
                              fontSize: 12,
                              marginTop: 2,
                              fontWeight: 'bold',
                            }}
                          >
                            {plat.qtd} registos de ganho
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.plataformaValor,
                          { color: textColor },
                        ]}
                      >
                        {formatarMoeda(plat.valor)}
                      </Text>
                    </View>

                    {/* Barra de Progresso (O Gráfico em si) */}
                    <View
                      style={[
                        styles.barraFundo,
                        {
                          backgroundColor: isDark
                            ? '#333'
                            : '#E0E0E0',
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.barraPreenchimento,
                          {
                            backgroundColor: corApp,
                            width: `${plat.percentual}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>

      {/* MODAL PERÍODO */}
      <Modal
        visible={modalPeriodo}
        transparent
        animationType="fade"
        onRequestClose={() => setModalPeriodo(false)}
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
                      periodoObj.id === p.id
                        ? '#00C853'
                        : 'transparent',
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
              onPress={() => setModalPeriodo(false)}
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

      {/* MODAL VEÍCULO */}
      <Modal
        visible={modalVeiculo}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVeiculo(false)}
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

            <TouchableOpacity
              style={[
                styles.btnAcao,
                {
                  backgroundColor: isDark
                    ? '#333'
                    : '#E0E0E0',
                  borderColor:
                    veiculoObj.id === 'todos'
                      ? '#00C853'
                      : 'transparent',
                },
              ]}
              onPress={() =>
                trocarVeiculo({
                  id: 'todos',
                  nome: 'Todos os Veículos',
                })
              }
            >
              <Text
                style={[
                  styles.btnAcaoTexto,
                  { color: textColor },
                ]}
              >
                Todos os Veículos
              </Text>
            </TouchableOpacity>

            {veiculosLista.map((v) => (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.btnAcao,
                  {
                    backgroundColor: isDark
                      ? '#333'
                      : '#E0E0E0',
                    borderColor:
                      veiculoObj.id === v.id
                        ? '#00C853'
                        : 'transparent',
                  },
                ]}
                onPress={() =>
                  trocarVeiculo({
                    id: v.id,
                    nome: `${v.modelo} - ${v.placa}`,
                  })
                }
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
              onPress={() => setModalVeiculo(false)}
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
    </SafeAreaView>
  );
}
