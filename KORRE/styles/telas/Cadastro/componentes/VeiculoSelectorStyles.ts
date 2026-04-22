import { StyleSheet } from 'react-native';

export const veiculoSelectorStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  botao: {
    flex: 1,
    backgroundColor: '#121212', // Fundo Dark Mode conforme Guia UX
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  ativo: {
    backgroundColor: '#FFD700', // Amarelo Segurança para estado ativo
    borderColor: '#FFD700',
  },
  texto: {
    color: '#555',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 8,
    letterSpacing: 1,
  },
  textoAtivo: {
    color: '#121212', // Texto preto sobre fundo amarelo
  },
});
