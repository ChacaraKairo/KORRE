import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#161616',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 25,
  },
  btnBack: {
    padding: 10,
    backgroundColor: '#161616',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#666',
    fontSize: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: '#222',
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  // List & Cards
  scrollContent: {
    padding: 20,
    paddingBottom: 140,
  },
  listContainer: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111',
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#222',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    color: '#444',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  itemCategory: {
    color: '#444',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Add Button
  btnAddManual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 18,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 200, 83, 0.4)', // Borda tracejada verde suave
    backgroundColor: 'rgba(0, 200, 83, 0.05)', // Fundo com 5% de transparência verde
    marginTop: 15,
  },
  btnAddIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 200, 83, 0.15)', // Fundo do ícone um pouco mais forte
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnAddText: {
    color: '#00C853', // Texto verde
    fontSize: 13, // Letra um pouco maior
    fontWeight: '900',
    letterSpacing: 0.5, // Espaçamento para dar um ar mais premium
  },
  // Info Box
  infoBox: {
    flexDirection: 'row',
    gap: 15,
    backgroundColor: '#161616',
    padding: 20,
    borderRadius: 24,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#222',
  },
  infoText: {
    color: '#666',
    fontSize: 11,
    flex: 1,
    lineHeight: 18,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderTopWidth: 1,
    borderColor: '#161616',
  },
  btnFinish: {
    height: 65,
    backgroundColor: '#00C853',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btnFinishText: {
    color: '#0A0A0A',
    fontWeight: '900',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#161616',
    borderRadius: 32,
    padding: 30,
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
  },
  previewCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
  },
  modalForm: {
    width: '100%',
    marginTop: 25,
  },
  modalLabel: {
    color: '#444',
    fontSize: 9,
    fontWeight: '900',
    marginBottom: 8,
    marginLeft: 5,
  },
  modalInput: {
    backgroundColor: '#0A0A0A',
    borderRadius: 16,
    padding: 15,
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 20,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  iconOption: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOptionActive: {
    borderColor: '#FFF',
    backgroundColor: '#222',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSaveModal: {
    width: '100%',
    height: 55,
    backgroundColor: '#00C853',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  btnSaveModalText: {
    color: '#0A0A0A',
    fontWeight: '900',
  },
  btnCancelModal: {
    marginTop: 15,
  },
  btnCancelModalText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
