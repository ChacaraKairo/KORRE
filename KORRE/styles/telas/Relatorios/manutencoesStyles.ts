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
  btnShare: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  // Filtros
  filtrosContainer: {
    gap: 12,
    marginBottom: 20,
  },
  filtroBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  filtroTexto: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Resumo
  cardResumo: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  resumoLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  resumoValor: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 16,
  },
  resumoRodape: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 8,
  },
  resumoRodapeTexto: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  // Lista Agrupada
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  itemIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemStats: {
    fontSize: 12,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '900',
  },
  itemQtdBadge: {
    backgroundColor: '#00C853',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  itemQtdTexto: {
    color: '#0A0A0A',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Modal de Partilha
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    marginBottom: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnAcao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
  },
  btnAcaoTexto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnCancelar: {
    marginTop: 8,
    padding: 16,
    alignItems: 'center',
  },
});
