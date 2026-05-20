import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

interface BackupPasswordModalProps {
  visible: boolean;
  title: string;
  message?: string;
  isDark: boolean;
  cardColor: string;
  borderColor: string;
  onCancel: () => void;
  onSubmit: (password: string) => void;
}

export const BackupPasswordModal = ({
  visible,
  title,
  message,
  isDark,
  cardColor,
  borderColor,
  onCancel,
  onSubmit,
}: BackupPasswordModalProps) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (visible) setPassword('');
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          backgroundColor: 'rgba(0,0,0,0.72)',
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 420,
            borderRadius: 8,
            borderWidth: 1,
            borderColor,
            backgroundColor: cardColor,
            padding: 18,
            gap: 14,
          }}
        >
          <View style={{ gap: 6 }}>
            <Text
              style={{
                color: isDark ? '#FFFFFF' : '#111111',
                fontSize: 16,
                fontWeight: '900',
              }}
            >
              {title}
            </Text>
            {message ? (
              <Text
                style={{
                  color: isDark ? '#999999' : '#555555',
                  fontSize: 13,
                  lineHeight: 18,
                }}
              >
                {message}
              </Text>
            ) : null}
          </View>

          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoFocus
            placeholder={t('configuracoes.senha_backup_placeholder')}
            placeholderTextColor={isDark ? '#666666' : '#888888'}
            style={{
              minHeight: 46,
              borderRadius: 8,
              borderWidth: 1,
              borderColor,
              paddingHorizontal: 12,
              color: isDark ? '#FFFFFF' : '#111111',
              backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5',
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={onCancel}
              style={{
                minHeight: 42,
                justifyContent: 'center',
                paddingHorizontal: 14,
              }}
            >
              <Text
                style={{
                  color: isDark ? '#FFFFFF' : '#111111',
                  fontWeight: '800',
                }}
              >
                {t('common.cancelar')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onSubmit(password)}
              disabled={!password.trim()}
              style={{
                minHeight: 42,
                justifyContent: 'center',
                borderRadius: 8,
                paddingHorizontal: 16,
                backgroundColor: '#00C853',
                opacity: password.trim() ? 1 : 0.5,
              }}
            >
              <Text
                style={{
                  color: '#0A0A0A',
                  fontWeight: '900',
                }}
              >
                {t('common.salvar')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
