// Arquivo: src/components/telas/Login/HeaderLoginStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 60,
  },
  iconContainer: {
    backgroundColor: '#00C853',
    padding: 20,
    borderRadius: 30,
    marginBottom: 20,
    // Sombra Neon Verde
    elevation: 15,
    shadowColor: '#00C853',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  titulo: {
    fontSize: 34,
    fontWeight: '900',
    color: '#00C853',
    letterSpacing: -1.5,
    textTransform: 'uppercase',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});
