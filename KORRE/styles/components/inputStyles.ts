import { StyleSheet } from 'react-native';

export const inputStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: '#AAA',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202020',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#333',
    height: 58,
    paddingHorizontal: 16,
  },
  inputWrapperFocus: {
    borderColor: '#00C853', // Borda verde ao focar
  },
  icon: {
    marginRight: 12,
  },
  field: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
});
