import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ArrowLeft, Search } from 'lucide-react-native';
import { styles } from '../../../styles/telas/OrigemGanhos/OrigemGanhosStyles';
interface HeaderOrigemProps {
  busca: string;
  setBusca: (t: string) => void;
}

export const HeaderOrigem: React.FC<HeaderOrigemProps> = ({
  busca,
  setBusca,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.title}>
            Configura o teu corre
          </Text>
          <Text style={styles.subtitle}>
            Onde ganhas o teu dinheiro?
          </Text>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Search size={18} color="#444" />
        <TextInput
          style={styles.searchInput}
          placeholder="Procurar empresa ou app..."
          placeholderTextColor="#444"
          value={busca}
          onChangeText={setBusca}
        />
      </View>
    </View>
  );
};
