import {
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  btnVoltar: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
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
    gap: 24,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginLeft: 8,
    marginBottom: 12,
  },
  sectionContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },

  // Setting Item
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1, // Permite que o texto ocupe o espaço disponível
  },
  iconBox: {
    padding: 10,
    borderRadius: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },

  // Lado Direito do Item
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemLabel: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  // Toggle Switch customizado
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  // Versão Info
  versaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  versaoBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00C853',
  },
});
