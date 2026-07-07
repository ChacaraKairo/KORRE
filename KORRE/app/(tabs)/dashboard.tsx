// app/(tabs)/dashboard.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChevronRight, Route } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

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
import { OfficialLinksBanner } from '../../components/OfficialLinksBanner';
import { AppRoutes } from '../../constants/routes';
import { setReturnRoute } from '../../utils/navigation/returnRoute';

export default function DashboardScreen() {
  const { t } = useTranslation();
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
    router.push(AppRoutes.configuracoes);
  const onTrocarVeiculo = () =>
    router.push(AppRoutes.garagem);
  const onIrParaOficina = () =>
    router.push(AppRoutes.oficina);
  const abrirCalculadora = () => {
    setReturnRoute(AppRoutes.dashboard);
    router.push(AppRoutes.calculadora);
  };

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
        nome={usuario?.nome || t('dashboard.boas_vindas')}
        fraseMotivacional={
          frase ? t(frase) : t('dashboard.frase_padrao')
        }
        fotoPerfil={usuario?.foto_uri}
        onPressConfig={onPressConfig}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Organism: Status do Veículo Ativo */}
        <VeiculoCard
          veiculo={veiculo}
          rendimento="0.15" // Idealmente viria do useEficiencia futuramente
          onGaragem={onTrocarVeiculo}
          onOficina={onIrParaOficina}
        />

        <OfficialLinksBanner isDark={isDark} compact />

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
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push(AppRoutes.analisarCorrida)}
          style={[
            styles.rideDecisionCard,
            {
              backgroundColor: isDark ? '#101F16' : '#E9FFF0',
              borderColor: isDark ? '#0E3B20' : '#B7F4C8',
            },
          ]}
        >
          <View style={styles.rideDecisionIconBox}>
            <Route size={22} color="#06140C" />
          </View>
          <View style={styles.rideDecisionCopy}>
            <Text
              style={[
                styles.rideDecisionTitle,
                { color: isDark ? '#FFFFFF' : '#06140C' },
              ]}
              numberOfLines={1}
            >
              {t('ride_decision.dashboard_cta')}
            </Text>
            <Text
              style={[
                styles.rideDecisionSubtitle,
                { color: isDark ? '#A7D7B4' : '#2B6B3D' },
              ]}
              numberOfLines={2}
            >
              {t('ride_decision.dashboard_cta_subtitle')}
            </Text>
          </View>
          <ChevronRight
            size={18}
            color={isDark ? '#00C853' : '#167A35'}
          />
        </TouchableOpacity>

        <GanhosCard
          ganhosTotal={financeiro?.ganhos || 0}
          metaValor={financeiro?.meta || 0}
          tipoMeta={usuario?.tipo_meta || 'diaria'}
          qtdGanhos={financeiro?.qtdGanhos || 0}
        />

        <GastosCard
          valor={financeiro?.gastos || 0}
          qtdGastos={financeiro?.qtdGastos || 0}
          tipoMeta={usuario?.tipo_meta || 'diaria'}
        />

        {/* Organism: Balanço Mensal Consolidado */}
        <FinanceiroMensal
          ganhos={financeiro?.ganhosMes || 0}
          gastos={financeiro?.gastosMes || 0}
        />

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
