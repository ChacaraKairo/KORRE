import { StyleSheet } from 'react-native';

export const inlineStyles = StyleSheet.create({
  inline0: {
          position: 'absolute',
          top: 50,
          right: 20,
          zIndex: 50,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        },
  inline1: {
          backgroundColor: '#161616',
          padding: 10,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#333',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
  inline7: {
          position: 'relative',
          top: 0,
          right: 0,
          zIndex: 1,
        },
  inline2: { flex: 1 },
  inline3: {
                width: 110,
                height: 110,
                marginBottom: 50,
              },
  inline4: {
                color: '#888',
                fontSize: 16,
                marginTop: -40,
                fontWeight: '500',
              },
  inline5: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
              marginBottom: 20,
            },
  inline6: { color: '#888', fontWeight: 'bold' },
});
