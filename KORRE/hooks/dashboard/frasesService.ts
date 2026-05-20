const listaFrases = [
  'dashboard.frases.bora_faturar',
  'dashboard.frases.foco_asfalto',
  'dashboard.frases.abencoe_corre',
  'dashboard.frases.mantenha_meta',
  'dashboard.frases.cada_entrega',
  'dashboard.frases.simbora_asfalto',
  'dashboard.frases.produtividade_maxima',
  'dashboard.frases.corre_nao_para',
  'dashboard.frases.fe_processo',
  'dashboard.frases.acelera_seguranca',
  'dashboard.frases.meta_batida',
  'dashboard.frases.dia_lucro',
  'dashboard.frases.persistencia',
  'dashboard.frases.gps_topo',
  'dashboard.frases.trabalhe_silencio',
];

export const getFraseDoMomento = (): string => {
  const agora = new Date();
  const diaDoMes = agora.getDate();
  const hora = agora.getHours();

  const baseIndex = (diaDoMes % 7) * 2;
  const fraseIndex = hora < 12 ? baseIndex : baseIndex + 1;

  return listaFrases[fraseIndex % listaFrases.length];
};
