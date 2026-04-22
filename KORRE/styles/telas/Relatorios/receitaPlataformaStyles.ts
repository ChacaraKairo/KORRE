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
  // Filtros
  filtrosContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  filtroBotao: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  filtroTexto: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Cartão Total
  cardTotal: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
  },
  labelTotal: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  valorTotal: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 8,
  },
  badgeTotal: {
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
  // Lista de Plataformas
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  plataformaCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  plataformaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  plataformaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconeCaixa: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plataformaNome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  plataformaPercentual: {
    fontSize: 12,
    marginTop: 2,
  },
  plataformaValor: {
    fontSize: 18,
    fontWeight: '900',
  },
  // Barra de Progresso (Gráfico)
  barraFundo: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  barraPreenchimento: {
    height: '100%',
    borderRadius: 4,
  },
  // Modais
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  btnAcao: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  btnAcaoTexto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnCancelar: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
});
