import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  View,
} from 'react-native';

// Importação dos Estilos (Caminho atualizado)
import { dashboardStyles as styles } from '../../styles/telas/Dashboard/dashboardStyles';

// Importação do Hook Personalizado
import { useDashboard } from '../../hooks/dashboard/useDashboard';
import { useTema } from '../../hooks/modo_tema';
import { useOficina } from '../../hooks/oficina/useOficina';

// Importação dos Componentes (Caminhos atualizados)
import { FinanceiroMensal } from '../../components/telas/Dashboard/FinanceiroMensal';
import { FooterCalculadora } from '../../components/telas/Dashboard/FooterCalculadora';
import { GanhosCard } from '../../components/telas/Dashboard/GanhosCard';
import { GastosCard } from '../../components/telas/Dashboard/GastosCard';
import { HeaderDashboard } from '../../components/telas/Dashboard/HeaderDashboard';
import { ModalUpdateKm } from '../../components/telas/Dashboard/ModalUpdateKm';
import { StatusGrid } from '../../components/telas/Dashboard/StatusGrid';
import { UltimasMovimentacoes } from '../../components/telas/Dashboard/UltimasMovimentacoes';
import { VeiculoCard } from '../../components/telas/Dashboard/VeiculoCard';

export default function DashboardScreen() {
  const {
    loading,
    usuario,
    frase,
    veiculo,
    ganhos,
    gastos,
    meta,
    tipoMeta,
    ganhosMensal,
    gastosMensal,
    qtdGanhos,
    qtdGastos,
    movimentacoes,
    onPressConfig,
    onTrocarVeiculo,
    onIrParaOficina,
    onUpdateKm,
    modalKmAberto,
    setModalKmAberto,
    novoKm,
    setNovoKm,
    salvarKm,
    abrirCalculadora,
  } = useDashboard();

  const { tema } = useTema();
  const isDark = tema === 'escuro';

  // Trazemos a inteligência da Oficina para verificar a próxima manutenção
  const { itensVisiveis, calcularProgresso } = useOficina();

  let statusManutencao: 'critical' | 'warning' | 'ok' =
    'ok';
  let descManutencao = 'Sem manutenções';

  if (itensVisiveis && itensVisiveis.length > 0) {
    const analisados = itensVisiveis.map((item) => {
      const prog = calcularProgresso(
        item,
        veiculo?.km_atual,
      );
      return {
        ...item,
        statusItem: prog.status,
        perc: prog.percentagemDesgaste,
      };
    });

    const criticos = analisados.filter(
      (i) => i.statusItem === 'Crítico',
    );
    const atencao = analisados.filter(
      (i) => i.statusItem === 'Atenção',
    );

    if (criticos.length > 0) {
      statusManutencao = 'critical';
      descManutencao =
        criticos.length === 1
          ? `Atrasada: ${criticos[0].nome}`
          : `${criticos.length} manutenções atrasadas`;
    } else if (atencao.length > 0) {
      statusManutencao = 'warning';
      descManutencao =
        atencao.length === 1
          ? `Atenção: ${atencao[0].nome}`
          : `${atencao.length} manutenções próximas`;
    } else {
      statusManutencao = 'ok';
      const proxima = analisados.reduce((prev, current) =>
        prev.perc > current.perc ? prev : current,
      );
      descManutencao = `Próxima: ${proxima.nome}`;
    }
  }

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <ActivityIndicator size="large" color="#00C853" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5' },
      ]}
    >
      <HeaderDashboard
        nome={usuario?.nome || 'Piloto'}
        fraseMotivacional={frase || 'Bora faturar!'}
        fotoPerfil={usuario?.foto_uri}
        onPressConfig={onPressConfig}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // Espaço para o Footer
      >
        <VeiculoCard
          veiculo={veiculo}
          rendimento="0.15"
          onTrocar={onTrocarVeiculo}
          onOficina={onIrParaOficina}
        />

        <StatusGrid
          kmAtual={veiculo?.km_atual ?? 0}
          statusManutencao={statusManutencao}
          descManutencao={descManutencao}
          onUpdateKm={onUpdateKm}
          onOpenOficina={onIrParaOficina}
        />

        <GanhosCard
          ganhosTotal={ganhos}
          metaValor={meta}
          tipoMeta={tipoMeta}
          qtdGanhos={qtdGanhos}
        />

        <GastosCard valor={gastos} qtdGastos={qtdGastos} />

        <FinanceiroMensal
          ganhos={ganhosMensal}
          gastos={gastosMensal}
        />

        <UltimasMovimentacoes dados={movimentacoes} />
      </ScrollView>

      <FooterCalculadora onPress={abrirCalculadora} />

      <ModalUpdateKm
        visible={modalKmAberto}
        onClose={() => setModalKmAberto(false)}
        onSave={salvarKm}
        km={novoKm}
        setKm={setNovoKm}
      />
    </View>
  );
}
