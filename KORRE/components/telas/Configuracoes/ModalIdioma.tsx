// src/components/telas/Configuracoes/ModalIdioma.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface Props {
  visible: boolean;
  onClose: () => void;
  idiomas: { code: string; label: string }[];
  isDark: boolean;
  cardColor: string;
  borderColor: string;
}

export const ModalIdioma = ({
  visible,
  onClose,
  idiomas,
  isDark,
  cardColor,
  borderColor,
}: Props) => {
  const { i18n } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <View
          style={{
            width: '100%',
            backgroundColor: cardColor,
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: isDark ? '#FFF' : '#000',
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            Selecione o Idioma (Futuro)
          </Text>
          {idiomas.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={{
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: borderColor,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                i18n.changeLanguage(lang.code);
                onClose();
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color:
                    i18n.language === lang.code
                      ? '#00C853'
                      : isDark
                        ? '#FFF'
                        : '#000',
                }}
              >
                {lang.label}
              </Text>
              {i18n.language === lang.code && (
                <Check size={20} color="#00C853" />
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={{
              marginTop: 20,
              paddingVertical: 14,
              backgroundColor: '#00C853',
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={onClose}
          >
            <Text
              style={{
                color: '#0A0A0A',
                fontWeight: 'bold',
              }}
            >
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
