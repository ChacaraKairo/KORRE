import { StyleSheet, Platform } from 'react-native';

export const dashboardStyles = StyleSheet.create({
  // Contentor Principal
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Preto puro do protótipo
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Header Dashboard
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#0A0A0A',
  },
  perfilContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#00C853', // Borda verde neon
    backgroundColor: '#161616',
    overflow: 'hidden',
  },
  nomeUsuario: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900', // Tipografia peso 900
  },
  tagMotivacional: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  textoMotivacional: {
    color: '#00C853',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  btnConfig: {
    padding: 10,
    backgroundColor: '#161616',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
  },

  // VeiculoCard
  cardPreto: {
    backgroundColor: '#161616',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#222',
    padding: 20,
    marginBottom: 16,
  },
  veiculoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  veiculoIconeBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#00C853',
    alignItems: 'center',
    justifyContent: 'center',
  },
  veiculoTextoPrimario: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  veiculoTextoSecundario: {
    color: '#00C853',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  eficienciaContainer: {
    alignItems: 'flex-end',
  },
  eficienciaLabel: {
    color: '#666',
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  eficienciaValor: {
    color: '#00C853',
    fontSize: 14,
    fontWeight: '900',
  },
  acoesVeiculoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  btnAcaoVeiculo: {
    flex: 1,
    height: 54,
    backgroundColor: '#202020',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  btnAcaoVeiculoTexto: {
    color: '#AAA',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  // Grid de Status (Odómetro e Manutenção)
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cardMeio: {
    flex: 1,
    backgroundColor: '#161616',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#222',
    padding: 16,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  btnPlusSmall: {
    width: 36,
    height: 36,
    backgroundColor: '#00C853',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valorDestaqueMeio: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
  },
  descStatusMeio: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardStatus_critical: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  cardStatus_warning: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  cardStatus_ok: {
    backgroundColor: 'rgba(0, 200, 83, 0.05)',
    borderColor: 'rgba(0, 200, 83, 0.2)',
  },
  textStatus_critical: { color: '#F44336' },
  textStatus_warning: { color: '#FFD700' },
  textStatus_ok: { color: '#00C853' },

  // GanhosCard e GastosCard
  cardGanhos: {
    backgroundColor: '#161616',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 16,
  },
  cardGastos: {
    backgroundColor: '#161616',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 24,
  },
  labelMeta: {
    color: '#666',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  valorMetaRestante: {
    color: '#00C853',
    fontSize: 18,
    fontWeight: '900',
  },
  labelGanhosHoje: {
    color: '#666',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 4,
  },
  valorGanhosBig: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '900',
  },
  valorGastosMed: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '900',
  },
  iconeGanhoBg: {
    padding: 12,
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    borderRadius: 16,
  },
  iconeGastoBg: {
    padding: 12,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 16,
  },
  barraProgressoBg: {
    height: 6,
    backgroundColor: '#222',
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  barraProgressoFill: {
    height: '100%',
    backgroundColor: '#00C853',
    borderRadius: 3,
  },

  // UltimasMovimentacoes
  labelSecaoNegrito: {
    color: '#666',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  btnVerTudo: {
    color: '#00C853',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  containerLista: {
    backgroundColor: '#161616',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  itemMovimentacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  miniBadgeIcone: {
    padding: 8,
    borderRadius: 12,
  },
  bgVerdeTrans: {
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
  },
  bgVermelhoTrans: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  txtCategoria: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  txtHora: {
    color: '#444',
    fontSize: 10,
    fontWeight: '500',
  },
  txtValorItem: { fontSize: 16, fontWeight: '900' },
  colorVerde: { color: '#00C853' },
  colorVermelho: { color: '#F44336' },
  textoVazio: {
    color: '#444',
    textAlign: 'center',
    paddingVertical: 20,
  },

  // Footer Calculadora
  footerFixo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
  },
  btnCalculadora: {
    height: 60,
    backgroundColor: '#00C853',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  btnCalculadoraTexto: {
    color: '#0A0A0A',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
