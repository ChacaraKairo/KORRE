import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Padrão de alto contraste do projeto
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    color: '#FFD700', // Amarelo para combinar com o ActivityIndicator
    marginTop: 10,
    fontSize: 16,
  },
});
