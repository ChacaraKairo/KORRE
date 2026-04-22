import React from 'react';
import {
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTema } from '../../hooks/modo_tema';
import { useHistorico } from '../../hooks/historico/useHistorico';
import { styles } from '../../styles/telas/Historico/historicoStyles';

// Componentes Extraídos e Refatorados
import { ModalEditarRegistro } from '../../components/telas/historico/ModalEditarRegistro';
import { ModalOpcoesRegistro } from '../../components/telas/historico/ModalOpcoesRegistro';
import { HeaderHistorico } from '../../components/telas/historico/HeaderHistorico';
import { ResumoGrafico } from '../../components/telas/historico/ResumoGrafico';
import { ListaMovimentacoes } from '../../components/telas/historico/ListaMovimentacoes';
import { ModalFiltroAvancado } from '../../components/telas/historico/ModalFiltroAvancado';

export default function HistoricoScreen() {
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const {
    loading,
    filtros,
    movimentacoes,
    categoriasDisponiveis,
    dadosResumo,
    registroSelecionado,
    setRegistroSelecionado,
    modalEdicao,
    setModalEdicao,
    modalFiltro,
    setModalFiltro,
    navegarData,
    salvarEdicao,
    deletarRegistro,
    atualizarFiltros,
    getLabelData,
  } = useHistorico();

  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: bgColor },
      ]}
      edges={['top']}
    >
      {/* Header atualizado com seletor de período rápido */}
      <HeaderHistorico
        getLabelData={getLabelData}
        navegarData={navegarData}
        onOpenFilter={() => setModalFiltro(true)}
        periodoAtual={filtros.periodo}
        onMudarPeriodo={(novoPeriodo) =>
          atualizarFiltros({ periodo: novoPeriodo })
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        {loading ? (
          <ActivityIndicator
            color="#00C853"
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            <ResumoGrafico dados={dadosResumo} />

            <ListaMovimentacoes
              movimentacoes={movimentacoes}
              onSelect={(item) =>
                setRegistroSelecionado(item)
              }
            />
          </>
        )}
      </ScrollView>

      {/* Modal de Filtro Avançado */}
      <ModalFiltroAvancado
        visible={modalFiltro}
        onClose={() => setModalFiltro(false)}
        filtrosAtuais={filtros}
        categoriasDisponiveis={categoriasDisponiveis}
        onAplicar={atualizarFiltros}
        isDark={isDark}
      />

      {/* Modal de Gestão de Registro */}
      <ModalOpcoesRegistro
        visible={!!registroSelecionado && !modalEdicao}
        item={registroSelecionado}
        onEdit={() => setModalEdicao(true)}
        onDelete={deletarRegistro}
        onClose={() => setRegistroSelecionado(null)}
      />

      {/* Modal de Edição */}
      <ModalEditarRegistro
        visible={modalEdicao}
        registro={registroSelecionado}
        isDark={isDark}
        onClose={() => setModalEdicao(false)}
        onSave={salvarEdicao}
      />
    </SafeAreaView>
  );
}
