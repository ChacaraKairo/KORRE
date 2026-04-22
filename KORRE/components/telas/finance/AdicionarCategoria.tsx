import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Briefcase,
  Smartphone,
  Car,
  Navigation,
  Package,
  Truck,
  Zap,
  ShoppingBag,
  Coffee,
  Wrench,
  Fuel,
  Tag,
  Home,
  Music,
} from 'lucide-react-native';
import { financeStyles as styles } from '../../../styles/telas/Finance/financeStyles';

const IconComponents: any = {
  Smartphone,
  Car,
  Navigation,
  Package,
  Truck,
  Briefcase,
  Zap,
  ShoppingBag,
  Coffee,
  Wrench,
  Fuel,
  Tag,
  Home,
  Music,
};
const iconList = Object.keys(IconComponents);

interface AdicionarCategoriaProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  nome: string;
  setNome: (nome: string) => void;
  icone: string;
  setIcone: (icone: string) => void;
  mainColor: string;
}

export const AdicionarCategoria = ({
  visible,
  onClose,
  onSave,
  nome,
  setNome,
  icone,
  setIcone,
  mainColor,
}: AdicionarCategoriaProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Nova Categoria
          </Text>

          <Text style={styles.modalLabel}>
            NOME DA CATEGORIA
          </Text>
          <TextInput
            style={[
              styles.modalInput,
              { borderColor: mainColor },
            ]}
            placeholder="Ex: Refeição, Gorjeta..."
            placeholderTextColor="#666"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.modalLabel}>
            ESCOLHER ÍCONE
          </Text>
          <View style={styles.modalIconGrid}>
            {iconList.map((ico) => {
              const Icon = IconComponents[ico];
              return (
                <TouchableOpacity
                  key={ico}
                  style={[
                    styles.modalIconOption,
                    icone === ico && {
                      borderColor: mainColor,
                      backgroundColor: `${mainColor}20`,
                    },
                  ]}
                  onPress={() => setIcone(ico)}
                >
                  <Icon
                    size={20}
                    color={
                      icone === ico ? mainColor : '#666'
                    }
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.modalButtonsRow}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalBtnCancel}
            >
              <Text style={styles.modalBtnCancelText}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSave}
              style={[
                styles.modalBtnSave,
                {
                  backgroundColor: mainColor,
                  opacity: nome.trim() ? 1 : 0.5,
                },
              ]}
              disabled={!nome.trim()}
            >
              <Text style={styles.modalBtnSaveText}>
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
