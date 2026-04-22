import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Target, Check, Pencil } from 'lucide-react-native';
import { styles } from '../../../styles/telas/Perfil/perfilStyles';
import { useTema } from '../../../hooks/modo_tema';

interface Props {
  meta: string;
  setMeta: (texto: string) => void;
  salvarMeta: () => void;
  tipoMeta: 'diaria' | 'semanal';
}

export const MetaFinanceira = ({
  meta,
  setMeta,
  salvarMeta,
  tipoMeta,
}: Props) => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  // Controle de estado para alternar entre visualização e edição
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Função para salvar e fechar o modo de edição
  const handleSave = () => {
    salvarMeta();
    setIsEditing(false);
  };

  // Função para abrir o input e focar automaticamente
  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={[
          styles.secaoTitle,
          {
            color: isDark ? '#FFFFFF' : '#000000',
            marginBottom: 8,
          },
        ]}
      >
        Meta Financeira
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={isEditing ? undefined : handleEditClick} // Clica no card para editar
        style={[
          styles.cardMeta,
          {
            backgroundColor: isDark ? '#161616' : '#FFFFFF',
            borderColor: isDark ? '#222' : '#E0E0E0',
            borderWidth: 1,
            flexDirection: 'row', // Deixa tudo na mesma linha (mais estreito)
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
            paddingHorizontal: 20,
            marginBottom: 0,
            borderRadius: 20,
          },
        ]}
      >
        {/* Esquerda: Ícone e Textos/Input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <View
            style={[
              styles.metaIconBox,
              { padding: 10, marginRight: 12 },
            ]}
          >
            <Target size={20} color="#00C853" />
          </View>

          <View style={{ flex: 1 }}>
            {/* Texto Dinâmico baseado no banco */}
            <Text
              style={[
                styles.metaLabel,
                {
                  color: isDark ? '#888' : '#555',
                  fontSize: 10,
                  marginBottom: 2,
                },
              ]}
            >
              OBJETIVO{' '}
              {tipoMeta === 'semanal'
                ? 'SEMANAL'
                : 'DIÁRIO'}
            </Text>

            {isEditing ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: isDark ? '#888' : '#555',
                    fontWeight: 'bold',
                    marginRight: 4,
                  }}
                >
                  R$
                </Text>
                <TextInput
                  ref={inputRef}
                  style={{
                    color: isDark ? '#00C853' : '#00A040',
                    fontSize: 20,
                    fontWeight: '900',
                    padding: 0,
                    flex: 1,
                  }}
                  value={meta}
                  onChangeText={setMeta}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={
                    isDark ? '#333' : '#999'
                  }
                  onSubmitEditing={handleSave} // Salva ao apertar Enter no teclado
                />
              </View>
            ) : (
              <Text
                style={{
                  color: isDark ? '#FFFFFF' : '#000000',
                  fontSize: 18,
                  fontWeight: '900',
                }}
              >
                R$ {meta || '0,00'}
              </Text>
            )}
          </View>
        </View>

        {/* Direita: Botão de Ação (Lápis ou Check) */}
        <View>
          {isEditing ? (
            <TouchableOpacity
              style={[
                styles.btnSalvarMeta,
                { padding: 10, marginLeft: 8 },
              ]}
              onPress={handleSave}
            >
              <Check
                size={18}
                color="#0A0A0A"
                strokeWidth={3}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ padding: 10 }}>
              <Pencil
                size={18}
                color={isDark ? '#666' : '#999'}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
