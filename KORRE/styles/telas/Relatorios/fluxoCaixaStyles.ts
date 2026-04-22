import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  btnVoltar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  // Seletor de Período
  periodoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  periodoBtn: {
    padding: 8,
  },
  periodoTexto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Cartão Principal (Saldo do Mês)
  cardPrincipal: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  labelPrincipal: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  valorPrincipal: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 16,
  },
  badgeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Resumo Entradas/Saídas
  linhaResumo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  cardMini: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  cardMiniLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardMiniValor: {
    fontSize: 16,
    fontWeight: '900',
  },
  // Histórico Diário
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  diaContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  diaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  diaData: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  diaSaldo: {
    fontSize: 14,
    fontWeight: '900',
  },
  diaValores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  diaValorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  diaValorTexto: {
    fontSize: 14,
    fontWeight: '600',
  },
});
