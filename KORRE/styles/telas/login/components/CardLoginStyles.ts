// Arquivo: src/styles/Login/CardLoginStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161616',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#222',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  authLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  authLabelText: {
    color: '#666',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '500',
  },
  inputWrapper: {
    marginBottom: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  btnEntrar: {
    flex: 1,
    backgroundColor: '#00C853',
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  btnEntrarText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  btnBiometria: {
    width: 58,
    height: 58,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkCadastro: {
    marginTop: 32,
    alignItems: 'center',
  },
  linkCadastroText: {
    color: '#666',
    fontSize: 14,
  },
  linkCadastroBold: {
    color: '#00C853',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
