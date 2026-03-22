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
    paddingBottom: 100, // Espaço para o botão fixo
    gap: 24,
  },
  sectionContainer: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // Componente Input
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputSuffix: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Botão Footer
  footerFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
  },
  btnSalvar: {
    backgroundColor: '#00C853',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  btnSalvarTexto: {
    color: '#0A0A0A',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
