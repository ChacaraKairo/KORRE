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

export function useRelatorios() {
  // PILAR 1: Saúde Financeira
  const relatoriosFinanceiros = [
    {
      id: 'balanco_dre',
      titulo: 'Balanço Geral (DRE)',
      desc: 'O seu lucro líquido real: Receitas vs Despesas Totais.',
      Icon: Briefcase,
      rota: '/relatorios/balanco_dre',
    },
    {
      id: 'fluxo_caixa',
      titulo: 'Fluxo de Caixa',
      desc: 'Entradas e saídas diárias/semanais para não faltar dinheiro.',
      Icon: Wallet,
      rota: 'relatorios/fluxo_caixa',
    },
  ];

  // PILAR 2: Inteligência de Pista (Operacional)
  const relatoriosOperacionais = [
    {
      id: 'receita_plataforma',
      titulo: 'Receita por Plataforma',
      desc: 'Qual app ou tipo de corrida rende mais?',
      Icon: Smartphone,
      rota: 'relatorios/receita_plataforma',
    },
    {
      id: 'produtividade',
      titulo: 'Produtividade (Dias/Horas)',
      desc: 'Descubra os melhores horários e o seu ganho real por KM.',
      Icon: Clock,
      rota: '',
    },
  ];

  // PILAR 3: A Máquina (Veículo e Manutenção)
  const relatoriosVeiculo = [
    {
      id: 'manutencoes',
      titulo: 'Manutenções (Oficina)',
      desc: 'Histórico de peças trocadas e custo total de oficina.',
      Icon: Wrench,
      rota: 'relatorios/manutencoes',
    },
    {
      id: 'consumo',
      titulo: 'Consumo (Combustível)',
      desc: 'Gasto total e custo do KM rodado na bomba de combustível.',
      Icon: Fuel,
      rota: '',
    },
  ];

  // PILAR 4: Fisco e Burocracia
  const relatoriosImpostos = [
    {
      id: 'termometro_mei',
      titulo: 'Termômetro MEI',
      desc: 'Controle de limite de faturação para não ser desenquadrado.',
      Icon: Gauge,
      rota: 'relatorios/temometro_mei',
    },
    {
      id: 'extrato_irpf',
      titulo: 'Extrato IRPF Anual',
      desc: 'Valores exatos (isentos e tributáveis) para a declaração.',
      Icon: Landmark,
      rota: '',
    },
    {
      id: 'carne_leao',
      titulo: 'Carnê-Leão',
      desc: 'Livro caixa e despesas dedutíveis para motorista pessoa física.',
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
