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

import { inlineStyles } from '../../styles/generated-inline/app/relatorios/manutencoesInlineStyles';
import { dynamicInlineStyles } from '../../styles/generated-dynamic/app/relatorios/manutencoesDynamicStyles';
// Hooks & Estilos
import { useTema } from '../../hooks/modo_tema';
import { useManutencoesReport } from '../../hooks/relatorios/useManutencoesReport';
import { styles } from '../../styles/telas/Relatorios/manutencoesStyles';
import { safeBack } from '../../utils/navigation/safeBack';

/**
 * Executa a função de manutencoes report screen.
 */
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

  /**
   * Executa a função de formatar moeda.
   */
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
          onPress={() => safeBack(router)}
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
              style={inlineStyles.inline1}
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
              style={inlineStyles.inline2}
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
              style={inlineStyles.inline3}
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
              style={inlineStyles.inline4}
            >
              Trocar
            </Text>
          </TouchableOpacity>
        </View>

        {/* === MAIN CONTENT === */}
        <View
          style={dynamicInlineStyles.inline1({ bgColor })}
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
              style={inlineStyles.inline5}
            >
              <Text
                style={dynamicInlineStyles.inline2({ textMuted })}
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
                    style={inlineStyles.inline6}
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
                  style={dynamicInlineStyles.inline3({ textMuted })}
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
                style={dynamicInlineStyles.inline4({ textMuted })}
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
                style={dynamicInlineStyles.inline5({ textMuted })}
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
                style={dynamicInlineStyles.inline6({ textMuted })}
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
          style={inlineStyles.inline7}
        >
          <ActivityIndicator
            size="large"
            color="#00C853"
            style={inlineStyles.inline8}
          />
          <Text
            style={inlineStyles.inline9}
          >
            Preparando o teu relatório...
          </Text>

          {/* ViewShot posicionado de forma oculta para não poluir a tela do usuário */}
          <View
            style={dynamicInlineStyles.inline7({})}
          >
            <ViewShot
              ref={viewShotRef}
              options={{ format: 'png', quality: 1 }}
              style={dynamicInlineStyles.inline8({ layoutParaPrint })}
            >
              {/* LAYOUT REDES SOCIAIS */}
              {layoutParaPrint === 'social' && (
                <View style={inlineStyles.inline10}>
                  <View style={inlineStyles.inline11}>
                    <Image
                      source={require('../../assets/images/android-icon-monochrome-safe.png')}
                      style={inlineStyles.inline12}
                    />
                    <Text
                      style={inlineStyles.inline13}
                    >
                      Relatório de Cuidados
                    </Text>
                  </View>

                  <View
                    style={inlineStyles.inline14}
                  >
                    <Text
                      style={inlineStyles.inline15}
                    >
                      Motorista de Excelência!
                    </Text>
                    <Text
                      style={inlineStyles.inline16}
                    >
                      O veículo{' '}
                      <Text
                        style={inlineStyles.inline17}
                      >
                        {veiculoSelecionado}
                      </Text>{' '}
                      está em ótimas mãos.
                    </Text>
                  </View>

                  <View
                    style={inlineStyles.inline18}
                  >
                    <View
                      style={inlineStyles.inline19}
                    >
                      <Text
                        style={inlineStyles.inline20}
                      >
                        Investimento
                      </Text>
                      <Text
                        style={inlineStyles.inline21}
                      >
                        {formatarMoeda(totalGasto)}
                      </Text>
                    </View>
                    <View
                      style={inlineStyles.inline22}
                    >
                      <Text
                        style={inlineStyles.inline23}
                      >
                        Serviços Feitos
                      </Text>
                      <Text
                        style={inlineStyles.inline24}
                      >
                        {totalServicos}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={inlineStyles.inline25}
                  >
                    <Text
                      style={inlineStyles.inline26}
                    >
                      Últimos Cuidados Realizados:
                    </Text>
                    {dadosAgrupados
                      .slice(0, 6)
                      .map((item) => (
                        <View
                          key={item.id}
                          style={inlineStyles.inline27}
                        >
                          <Wrench
                            size={16}
                            color="#00C853"
                            style={inlineStyles.inline28}
                          />
                          <Text
                            style={inlineStyles.inline29}
                          >
                            {item.nome}
                          </Text>
                          <View
                            style={inlineStyles.inline30}
                          >
                            <Text
                              style={inlineStyles.inline31}
                            >
                              {item.quantidade}x
                            </Text>
                          </View>
                        </View>
                      ))}
                  </View>

                  <View
                    style={inlineStyles.inline32}
                  >
                    <Text
                      style={inlineStyles.inline33}
                    >
                      BAIXE O APP KORRE E TENHA O
                      CONTROLO DA TUA MÁQUINA
                    </Text>
                  </View>
                </View>
              )}

              {/* LAYOUT PLANILHA PARA MECÂNICO */}
              {layoutParaPrint === 'mecanico' && (
                <View style={inlineStyles.inline34}>
                  <View
                    style={inlineStyles.inline35}
                  >
                    <View>
                      <Image
                        source={require('../../assets/images/android-icon-monochrome-safe.png')}
                        style={inlineStyles.inline36}
                      />
                      <Text
                        style={inlineStyles.inline37}
                      >
                        Ficha Técnica de Oficina
                      </Text>
                    </View>
                    <View
                      style={inlineStyles.inline38}
                    >
                      <Text
                        style={inlineStyles.inline39}
                      >
                        {veiculoSelecionado}
                      </Text>
                      <Text
                        style={inlineStyles.inline40}
                      >
                        Período: {periodo}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={inlineStyles.inline41}
                  >
                    <Text
                      style={inlineStyles.inline42}
                    >
                      Resumo do Histórico:
                    </Text>
                    <Text
                      style={inlineStyles.inline43}
                    >
                      Foram registados{' '}
                      <Text style={inlineStyles.inline44}>
                        {totalServicos} procedimentos
                      </Text>{' '}
                      de manutenção para este veículo no
                      período selecionado.
                    </Text>
                  </View>

                  <View style={inlineStyles.inline45}>
                    <View
                      style={inlineStyles.inline46}
                    >
                      <Text
                        style={inlineStyles.inline47}
                      >
                        Serviço Realizado
                      </Text>
                      <Text
                        style={inlineStyles.inline48}
                      >
                        Última Troca
                      </Text>
                      <Text
                        style={inlineStyles.inline49}
                      >
                        Frequência
                      </Text>
                    </View>

                    {dadosAgrupados.map((item, index) => (
                      <View
                        key={item.id}
                        style={dynamicInlineStyles.inline9({ index })}
                      >
                        <Text
                          style={inlineStyles.inline50}
                        >
                          {item.nome}
                        </Text>
                        <Text
                          style={inlineStyles.inline51}
                        >
                          {item.ultimaData}
                        </Text>
                        <Text
                          style={inlineStyles.inline52}
                        >
                          {item.quantidade}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View
                    style={inlineStyles.inline53}
                  >
                    <Text
                      style={inlineStyles.inline54}
                    >
                      DOCUMENTO GERADO DE FORMA AUTOMÁTICA
                      PELO APLICATIVO KORRE
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
