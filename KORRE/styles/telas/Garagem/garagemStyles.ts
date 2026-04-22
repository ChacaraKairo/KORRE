import {
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight
        : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#161616',
  },
  btnVoltar: {
    padding: 8,
    backgroundColor: '#161616',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: '#00C853',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Resumo Frota (Topo)
  resumoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  resumoLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  resumoValor: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
  },
  btnAddVeiculo: {
    height: 48,
    width: 48,
    backgroundColor: '#00C853',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Card Veículo
  cardVeiculo: {
    borderRadius: 32,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  cardInner: {
    padding: 24,
    zIndex: 10,
  },
  cardHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  iconVeiculoBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  modeloText: {
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  placaText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 4,
  },
  badgeAtivo: {
    backgroundColor: '#00C853',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeAtivoText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#0A0A0A',
    textTransform: 'uppercase',
  },

  // Info Técnica (Grids)
  gridInfo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  boxInfo: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 10, 0.4)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 34, 34, 0.3)',
  },
  boxInfoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  boxInfoLabel: {
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#444',
  },
  boxInfoValor: {
    fontSize: 16,
    fontWeight: '900',
  },

  // Ações do Card
  acoesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  btnAtivar: {
    flex: 2,
    height: 48,
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 83, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnGerir: {
    flex: 2,
    height: 48,
    backgroundColor: '#00C853',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnAtivarTexto: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#00C853',
  },
  btnGerirTexto: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#0A0A0A',
  },
  btnApagar: {
    height: 48,
    width: 48,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermark: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    opacity: 0.03,
    transform: [{ rotate: '12deg' }],
  },

  // Nota Informativa
  notaInfo: {
    backgroundColor: '#161616',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#222',
    padding: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginTop: 8,
  },
  notaTexto: {
    flex: 1,
    fontSize: 11,
    color: '#555',
    lineHeight: 18,
  },
});
