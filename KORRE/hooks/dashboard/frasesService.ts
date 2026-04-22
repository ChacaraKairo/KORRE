// MeuCorre/hooks/dashboard/frasesService.ts
// Lista de 15 frases motivacionais para o "corre"
const listaFrases = [
  'Bora faturar!',
  'Foco no asfalto!',
  'Deus abençoe o corre.',
  'Mantenha a meta!',
  'Cada entrega conta.',
  'Simbora pro asfalto!',
  'Produtividade máxima!',
  'O corre não para.',
  'Fé no processo.',
  'Acelera com segurança.',
  'Meta batida, mente tranquila.',
  'Hoje é dia de lucro.',
  'Persistência é a chave.',
  'Olho no GPS, mente no topo.',
  'Trabalhe duro em silêncio.',
];

export const getFraseDoMomento = (): string => {
  const agora = new Date();
  const diaDoMes = agora.getDate();
  const hora = agora.getHours();

  // Seleciona um índice baseado no dia do mês para variar as 15 frases
  // O resto da divisão por 7 garante que tenhamos frases diferentes ao longo da semana
  const baseIndex = (diaDoMes % 7) * 2;

  // Se for antes do meio-dia (12h), pega a primeira frase do par, senão a segunda
  const fraseIndex = hora < 12 ? baseIndex : baseIndex + 1;

  // Garante que o índice não ultrapasse o tamanho da lista (15 frases)
  return listaFrases[fraseIndex % listaFrases.length];
};
