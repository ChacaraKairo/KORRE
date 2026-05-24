import {
  Briefcase,
  Wallet,
  Smartphone,
  Clock,
  Wrench,
  Fuel,
  FileText,
  Gauge,
  Landmark,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

/**
 * Executa a função de use relatorios.
 */
export function useRelatorios() {
  const { t } = useTranslation();
  // PILAR 1: Saúde Financeira
  const relatoriosFinanceiros = [
    {
      id: 'balanco_dre',
      titulo: t('relatorios.items.balanco_dre_titulo'),
      desc: t('relatorios.items.balanco_dre_desc'),
      Icon: Briefcase,
      rota: '/relatorios/balanco_dre',
    },
    {
      id: 'fluxo_caixa',
      titulo: t('relatorios.items.fluxo_caixa_titulo'),
      desc: t('relatorios.items.fluxo_caixa_desc'),
      Icon: Wallet,
      rota: 'relatorios/fluxo_caixa',
    },
  ];

  // PILAR 2: Inteligência de Pista (Operacional)
  const relatoriosOperacionais = [
    {
      id: 'receita_plataforma',
      titulo: t('relatorios.items.receita_plataforma_titulo'),
      desc: t('relatorios.items.receita_plataforma_desc'),
      Icon: Smartphone,
      rota: 'relatorios/receita_plataforma',
    },
    {
      id: 'produtividade',
      titulo: t('relatorios.items.produtividade_titulo'),
      desc: t('relatorios.items.produtividade_desc'),
      Icon: Clock,
      rota: '',
    },
  ];

  // PILAR 3: A Máquina (Veículo e Manutenção)
  const relatoriosVeiculo = [
    {
      id: 'manutencoes',
      titulo: t('relatorios.items.manutencoes_titulo'),
      desc: t('relatorios.items.manutencoes_desc'),
      Icon: Wrench,
      rota: 'relatorios/manutencoes',
    },
    {
      id: 'consumo',
      titulo: t('relatorios.items.consumo_titulo'),
      desc: t('relatorios.items.consumo_desc'),
      Icon: Fuel,
      rota: '',
    },
  ];

  // PILAR 4: Fisco e Burocracia
  const relatoriosImpostos = [
    {
      id: 'termometro_mei',
      titulo: t('relatorios.items.termometro_mei_titulo'),
      desc: t('relatorios.items.termometro_mei_desc'),
      Icon: Gauge,
      rota: 'relatorios/temometro_mei',
    },
    {
      id: 'extrato_irpf',
      titulo: t('relatorios.items.extrato_irpf_titulo'),
      desc: t('relatorios.items.extrato_irpf_desc'),
      Icon: Landmark,
      rota: '',
    },
    {
      id: 'carne_leao',
      titulo: t('relatorios.items.carne_leao_titulo'),
      desc: t('relatorios.items.carne_leao_desc'),
      Icon: FileText,
      rota: '/relatorios/carne-leao',
    },
  ];

  return {
    relatoriosFinanceiros,
    relatoriosOperacionais,
    relatoriosVeiculo,
    relatoriosImpostos,
  };
}
