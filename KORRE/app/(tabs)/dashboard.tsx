// app/(tabs)/dashboard.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  View,
} from 'react-native';

// Camada de Estilos Consolidada
import { dashboardStyles as styles } from '../../styles/telas/Dashboard/dashboardStyles';
// Camada de Lógica (Hooks Maestro)
import { useDashboard } from '../../hooks/dashboard/useDashboard';
import { useTema } from '../../hooks/modo_tema';
import { useOficina } from '../../hooks/oficina/useOficina';

// Organismos de Interface
import { FinanceiroMensal } from '../../components/telas/Dashboard/FinanceiroMensal';
import { FooterCalculadora } from '../../components/telas/Dashboard/FooterCalculadora';
import { GanhosCard } from '../../components/telas/Dashboard/GanhosCard';
import { GastosCard } from '../../components/telas/Dashboard/GastosCard';
import { HeaderDashboard } from '../../components/telas/Dashboard/HeaderDashboard';
import { IndicesMCCard } from '../../components/telas/Dashboard/IndicesKORRE';
import { ModalUpdateKm } from '../../components/telas/Dashboard/ModalUpdateKm';
import { StatusGrid } from '../../components/telas/Dashboard/StatusGrid';
import { UltimasMovimentacoes } from '../../components/telas/Dashboard/UltimasMovimentacoes';
import { VeiculoCard } from '../../components/telas/Dashboard/VeiculoCard';

export default function DashboardScreen() {
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const themeBg = {
    backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5',
  };
  const router = useRouter();

  // Estados Locais da UI (Modal de KM)
  const [modalKmAberto, setModalKmAberto] = useState(false);
  const [novoKm, setNovoKm] = useState('');

  // 1. Hook Principal de Dados e Ações
  const {
    loading,
    usuario,
    frase,
    veiculo,
    financeiro,
    movimentacoes,
    onUpdateKm,
  } = useDashboard();

  // 2. Hook de Especialidade (Oficina)
  const {
    itensVisiveis,
    temManutencaoBanco,
    calcularProgresso,
  } = useOficina();

  // Handlers de Navegação
  const onPressConfig = () =>
    router.push('/(tabs)/configuracoes' as any);
  const onTrocarVeiculo = () =>
    router.push('/(tabs)/garagem' as any);
  const onIrParaOficina = () =>
    router.push('/(tabs)/oficina' as any);
  const abrirCalculadora = () =>
    router.push('/calculadora' as any);

  // Handler do Modal de KM
  const salvarKm = async () => {
    const kmNumerico = Number(
      String(novoKm).replace(/\D/g, ''),
    );
    if (!isNaN(kmNumerico)) {
      await onUpdateKm(kmNumerico);
      setModalKmAberto(false);
      setNovoKm('');
    }
  };

  // Atom de Carregamento Centralizado
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          themeBg,
          {
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
    <View style={[styles.container, themeBg]}>
      {/* Organism: Top Bar & Perfil */}
      <HeaderDashboard
        nome={usuario?.nome || 'Piloto'}
        fraseMotivacional={frase || 'Bora faturar!'}
        fotoPerfil={usuario?.foto_uri}
        onPressConfig={onPressConfig}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Organism: Status do Veículo Ativo */}
        <VeiculoCard
          veiculo={veiculo}
          rendimento="0.15" // Idealmente viria do useEficiencia futuramente
          onGaragem={onTrocarVeiculo}
          onOficina={onIrParaOficina}
        />

        {/* Organism: Grade de Manutenção Preventiva (O Coração da Oficina no Dash) */}
        <StatusGrid
          kmAtual={veiculo?.km_atual ?? 0}
          itensVisiveis={itensVisiveis}
          temManutencaoBanco={temManutencaoBanco}
          calcularProgresso={calcularProgresso}
          onUpdateKm={() => setModalKmAberto(true)}
          onOpenOficina={onIrParaOficina}
        />

        {/* Organism: Indicadores de Custo Real */}
        <IndicesMCCard
          custoPorKm={veiculo?.custo_km_calculado || 0}
          custoPorMinuto={
            veiculo?.custo_minuto_calculado || 0
          }
          metaPorMinuto={
            veiculo?.meta_ganho_minuto_calculado || 0
          } // <-- A mágica entra aqui
        />

        {/* Organism: Resumo de Performance Diária/Semanal */}
        <GanhosCard
          ganhosTotal={financeiro?.ganhos || 0}
          metaValor={financeiro?.meta || 0}
          tipoMeta={usuario?.tipo_meta || 'diaria'}
          qtdGanhos={financeiro?.qtdGanhos || 0}
        />

        <GastosCard
          valor={financeiro?.gastos || 0}
          qtdGastos={0}
        />

        {/* Organism: Balanço Mensal Consolidado */}
        <FinanceiroMensal ganhos={0} gastos={0} />

        {/* Organism: Feed de Atividades Recentes */}
        <UltimasMovimentacoes dados={movimentacoes} />
      </ScrollView>

      {/* Floating Action Component */}
      <FooterCalculadora onPress={abrirCalculadora} />

      {/* Controlled Modals */}
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
