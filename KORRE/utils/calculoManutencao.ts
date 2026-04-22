// Arquivo: src/utils/calculoManutencao.ts

export interface ResultadoProgresso {
  percentagemDesgaste: number;
  cor: string;
  status:
    | 'OK'
    | 'Atenção'
    | 'Urgente'
    | 'Crítico'
    | 'Inicial';
  infoTexto: string;
}

export const calcularDesgasteItem = (
  item: any,
  kmAtual?: number,
): ResultadoProgresso => {
  if (kmAtual === undefined)
    return {
      percentagemDesgaste: 0,
      cor: '#00C853',
      status: 'OK',
      infoTexto: '',
    };

  // Estado Inicial (Sem dados de troca)
  if (
    item.ultima_troca_km === null &&
    item.ultima_troca_data === null
  ) {
    return {
      percentagemDesgaste: 0,
      cor: '#FF9800',
      status: 'Inicial',
      infoTexto: 'Não registada',
    };
  }

  let isCritico = false;
  let isUrgente = false;
  let isAtencao = false;

  let percKm = 0;
  let kmRestante = Infinity;

  // ----------------------------------------------------
  // LÓGICA DE QUILOMETRAGEM
  // ----------------------------------------------------
  if (item.intervalo_km && item.ultima_troca_km !== null) {
    const rodado = kmAtual - item.ultima_troca_km;
    percKm = (rodado / item.intervalo_km) * 100;
    kmRestante = item.intervalo_km - rodado;

    // Gatilhos inteligentes: O que for menor entre a % e o valor fixo
    const limAtencao = Math.min(
      item.intervalo_km * 0.2,
      500,
    );
    const limUrgente = Math.min(
      item.intervalo_km * 0.1,
      250,
    );
    const limCritico = Math.min(
      item.intervalo_km * 0.05,
      100,
    );

    if (rodado > 0) {
      if (kmRestante <= limCritico) isCritico = true;
      else if (kmRestante <= limUrgente) isUrgente = true;
      else if (kmRestante <= limAtencao) isAtencao = true;
    }
  }

  // ----------------------------------------------------
  // LÓGICA DE TEMPO (Ajustada para evitar alertas precoces)
  // ----------------------------------------------------
  let percTempo = 0;
  let diasRestantes = Infinity;

  if (item.intervalo_meses && item.ultima_troca_data) {
    const ultimaTroca = new Date(item.ultima_troca_data);
    const hoje = new Date();

    const diffInMs = hoje.getTime() - ultimaTroca.getTime();
    const diasPassados = Math.floor(
      diffInMs / (1000 * 60 * 60 * 24),
    );

    const diasIntervalo = item.intervalo_meses * 30;
    percTempo = (diasPassados / diasIntervalo) * 100;
    diasRestantes = diasIntervalo - diasPassados;

    // Só avalia alertas de tempo se já passou pelo menos 1 dia
    if (diasPassados > 0) {
      if (diasRestantes <= 5) isCritico = true;
      else if (diasRestantes <= 15) isUrgente = true;
      // Ajuste: Atenção apenas se faltar menos de 30 dias E já tiver passado 70% do tempo total
      else if (diasRestantes < 30 && percTempo > 70)
        isAtencao = true;
    }
  }

  // ----------------------------------------------------
  // RESOLUÇÃO FINAL
  // ----------------------------------------------------
  const percentagemDesgaste = Math.max(
    0,
    Math.min(100, Math.max(percKm, percTempo)),
  );

  let status: 'OK' | 'Atenção' | 'Urgente' | 'Crítico' =
    'OK';
  let cor = '#00C853'; // Verde

  if (isCritico) {
    status = 'Crítico';
    cor = '#EF4444'; // Vermelho
  } else if (isUrgente) {
    status = 'Urgente';
    cor = '#F97316'; // Laranja
  } else if (isAtencao) {
    status = 'Atenção';
    cor = '#FBBF24'; // Amarelo
  }

  // Geração do texto informativo para exibição no card
  let infoTexto = '';
  if (item.intervalo_km > 0 && item.intervalo_meses > 0) {
    infoTexto =
      percTempo > percKm
        ? diasRestantes > 0
          ? `Faltam ${diasRestantes} dias`
          : `Excedido em ${Math.abs(diasRestantes)} dias`
        : kmRestante > 0
          ? `Faltam ${kmRestante} km`
          : `Excedido em ${Math.abs(kmRestante)} km`;
  } else if (item.intervalo_meses > 0) {
    infoTexto =
      diasRestantes > 0
        ? `Faltam ${diasRestantes} dias`
        : `Excedido em ${Math.abs(diasRestantes)} dias`;
  } else if (item.intervalo_km > 0) {
    infoTexto =
      kmRestante > 0
        ? `Faltam ${kmRestante} km`
        : `Excedido em ${Math.abs(kmRestante)} km`;
  }

  return {
    percentagemDesgaste,
    cor,
    status,
    infoTexto,
  };
};
