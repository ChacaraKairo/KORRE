import { useState } from 'react';
import { useRouter } from 'expo-router';

export function useOficina() {
  const router = useRouter();

  // Lista de veículos (No futuro virá do SQLite: SELECT * FROM veiculos)
  const [frota, setFrota] = useState([
    {
      id: 1,
      tipo: 'moto',
      marca: 'Honda',
      modelo: 'CG 160 Fan',
      kmAtual: 12840,
      placa: 'ABC-1D23',
    },
    {
      id: 2,
      tipo: 'carro',
      marca: 'Fiat',
      modelo: 'Uno Mobi',
      kmAtual: 45200,
      placa: 'XYZ-9W87',
    },
  ]);

  const [veiculoAtivo, setVeiculoAtivo] = useState(1);
  const [abaAtiva, setAbaAtiva] = useState<
    'pendentes' | 'historico'
  >('pendentes');
  const [modalReset, setModalReset] = useState({
    visivel: false,
    item: null as any,
  });

  const veiculoSelecionado = frota.find(
    (v) => v.id === veiculoAtivo,
  );

  // Itens de Manutenção (Simulação - depois virá do banco)
  const [itensManutencao, setItensManutencao] = useState([
    {
      id: 101,
      nome: 'Óleo do Motor',
      icone: 'Droplets',
      ultimaTrocaKm: 11000,
      intervaloKm: 2000,
      criticidade: 'alta',
    },
    {
      id: 102,
      nome: 'Pastilha de Freio',
      icone: 'Disc',
      ultimaTrocaKm: 8500,
      intervaloKm: 5000,
      criticidade: 'media',
    },
    {
      id: 103,
      nome: 'Pneu Traseiro',
      icone: 'CircleDot',
      ultimaTrocaKm: 5000,
      intervaloKm: 10000,
      criticidade: 'baixa',
    },
    {
      id: 104,
      nome: 'Relação (Corrente)',
      icone: 'Cog',
      ultimaTrocaKm: 2000,
      intervaloKm: 15000,
      criticidade: 'baixa',
    },
  ]);

  // Cálculos de Saúde e Progresso
  const calcularProgresso = (item: any) => {
    if (!veiculoSelecionado) return 0;
    const kmRodados =
      veiculoSelecionado.kmAtual - item.ultimaTrocaKm;
    const progresso = (kmRodados / item.intervaloKm) * 100;
    return Math.min(Math.max(progresso, 0), 100);
  };

  const calcularSaudeGeral = () => {
    if (!veiculoSelecionado || itensManutencao.length === 0)
      return 100;
    const progressos = itensManutencao.map(
      calcularProgresso,
    );
    const mediaDesgaste =
      progressos.reduce((acc, curr) => acc + curr, 0) /
      progressos.length;
    return Math.max(0, Math.round(100 - mediaDesgaste));
  };

  const getStatusColor = (progresso: number) => {
    if (progresso >= 90) return '#F44336'; // Vermelho (Crítico)
    if (progresso >= 75) return '#FF9800'; // Laranja (Atenção)
    return '#00C853'; // Verde (Ok)
  };

  const handleVoltar = () => router.back();

  return {
    frota,
    veiculoAtivo,
    setVeiculoAtivo,
    veiculoSelecionado,
    abaAtiva,
    setAbaAtiva,
    itensManutencao,
    modalReset,
    setModalReset,
    calcularProgresso,
    calcularSaudeGeral,
    getStatusColor,
    handleVoltar,
  };
}
