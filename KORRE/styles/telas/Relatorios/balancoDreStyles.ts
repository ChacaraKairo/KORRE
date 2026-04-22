import { StyleSheet, Platform } from 'react-native';

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
  // Cartão Principal (Lucro Líquido)
  cardPrincipal: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  labelPrincipal: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    opacity: 0.9,
  },
  valorPrincipal: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 16,
  },
  margemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  margemTexto: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  // Cartões de Detalhe (Receitas e Despesas)
  linhaCards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  cardDetalhe: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardDetalheHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardDetalheLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardDetalheValor: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Seção de Quebra (Breakdown)
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  linhaBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  breakdownLabel: {
    fontSize: 14,
  },
  breakdownValor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
