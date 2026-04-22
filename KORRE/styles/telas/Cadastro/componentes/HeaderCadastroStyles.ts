// Arquivo: src/components/telas/Cadastro/HeaderCadastroStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  iconContainer: {
    backgroundColor: '#00C853',
    padding: 16,
    borderRadius: 25,
    marginBottom: 16,
    elevation: 10,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});
