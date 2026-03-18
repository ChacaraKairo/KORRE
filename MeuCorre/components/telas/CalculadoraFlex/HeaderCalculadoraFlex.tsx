import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTema } from '../../../hooks/modo_tema';

export default function HeaderCalculadoraFlex({
  setModalAjuda,
  origem,
}: {
  setModalAjuda: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  origem?: string;
}) {
  const router = useRouter();

  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const handleBack = () => {
    if (origem === 'login') {
      router.replace('/(auth)/login');
    } else {
      router.replace('/dashboard');
    }
  };

  return (
    <View
      style={[
        styles.header,
        {
          borderBottomColor: isDark ? '#161616' : '#E0E0E0',
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.headerBtn,
          {
            backgroundColor: isDark ? '#161616' : '#FFFFFF',
            borderColor: isDark ? '#222' : '#E0E0E0',
          },
        ]}
        activeOpacity={0.8}
        onPress={handleBack}
      >
        <Ionicons
          name="arrow-back"
          size={20}
          color={isDark ? '#666' : '#333'}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        Calculadora Flex
      </Text>
      <TouchableOpacity
        style={styles.headerHelpBtn}
        onPress={() => setModalAjuda(true)}
        activeOpacity={0.8}
      >
        <Ionicons
          name="help-circle"
          size={20}
          color="#00C853"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#161616',
  },
  headerBtn: {
    padding: 8,
    backgroundColor: '#161616',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#00C853',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  headerHelpBtn: {
    padding: 8,
    backgroundColor: 'rgba(0,200,83,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,200,83,0.2)',
  },
});
