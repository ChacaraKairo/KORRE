import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  Bell,
  Globe,
  Info,
  ArrowLeft,
  Moon,
  Sun,
  ShieldCheck,
  HelpCircle,
  FileText,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Lógica e Estilos
import { useTema } from '../../hooks/modo_tema';
import { styles } from '../../styles/telas/Configuracoes/configuracoesStyles';

// Componentes
import { SettingItem } from '../../components/telas/Configuracoes/SettingItem';

export default function ConfiguracoesScreen() {
  const router = useRouter();

  // Usando o seu Hook global de Tema
  const { tema, setTema } = useTema();
  const isDark = tema === 'escuro';

  // Estados locais para outras configurações
  const [notificacoes, setNotificacoes] = useState(true);
  const [idioma, setIdioma] = useState('Português (PT)');

  // Cores dinâmicas para a base da tela
  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textMuted = isDark ? '#666' : '#888';

  // Função para lidar com a troca de tema
  const handleToggleTema = () => {
    if (setTema) setTema(isDark ? 'claro' : 'escuro');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: bgColor },
      ]}
    >
      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            borderBottomColor: isDark
              ? '#161616'
              : '#EAEAEA',
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.btnVoltar,
            { backgroundColor: cardColor, borderColor },
          ]}
          onPress={() => router.back()}
        >
          <ArrowLeft
            size={20}
            color={isDark ? '#FFF' : '#1A1A1A'}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Ajustes do App
        </Text>
        <View style={{ width: 36 }} /> {/* Espaçador */}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SECÇÃO: PERSONALIZAÇÃO */}
        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: textMuted },
            ]}
          >
            Aparência e Notificações
          </Text>
          <View
            style={[
              styles.sectionContainer,
              { borderColor },
            ]}
          >
            <SettingItem
              isDark={isDark}
              icon={isDark ? Moon : Sun}
              title="Modo de Visualização"
              subtitle={isDark ? 'Escuro' : 'Claro'}
              action="toggle"
              value={{
                current: isDark,
                setter: handleToggleTema,
              }}
            />
            <SettingItem
              isDark={isDark}
              isLast={true}
              icon={Bell}
              title="Notificações Push"
              subtitle="Alertas de metas e manutenção"
              action="toggle"
              value={{
                current: notificacoes,
                setter: setNotificacoes,
              }}
            />
          </View>
        </View>

        {/* SECÇÃO: LINGUAGEM */}
        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: textMuted },
            ]}
          >
            Regional
          </Text>
          <View
            style={[
              styles.sectionContainer,
              { borderColor },
            ]}
          >
            <SettingItem
              isDark={isDark}
              isLast={true}
              icon={Globe}
              title="Idioma do Sistema"
              subtitle="Formatos de data e moeda"
              value={{ label: idioma }}
              onClick={() =>
                Alert.alert(
                  'Idioma',
                  'Apenas Português disponível no momento.',
                )
              }
            />
          </View>
        </View>

        {/* SECÇÃO: SEGURANÇA */}
        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: textMuted },
            ]}
          >
            Privacidade
          </Text>
          <View
            style={[
              styles.sectionContainer,
              { borderColor },
            ]}
          >
            <SettingItem
              isDark={isDark}
              isLast={true}
              icon={ShieldCheck}
              title="Privacidade de Dados"
              subtitle="Gerir segurança local"
              value={{ label: 'Ver' }}
              onClick={() =>
                Alert.alert(
                  'Privacidade',
                  'Seus dados são salvos apenas no seu celular.',
                )
              }
            />
          </View>
        </View>

        {/* SECÇÃO: SOBRE */}
        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: textMuted },
            ]}
          >
            Suporte e Info
          </Text>
          <View
            style={[
              styles.sectionContainer,
              { borderColor },
            ]}
          >
            <SettingItem
              isDark={isDark}
              icon={HelpCircle}
              title="Central de Ajuda"
              subtitle="Dúvidas e tutoriais"
              onClick={() => router.push('/suporte')} // Link para a tela de Suporte que já criamos!
            />
            <SettingItem
              isDark={isDark}
              icon={FileText}
              title="Termos e Condições"
              subtitle="Políticas de uso"
              onClick={() => router.push('/termos')} // Link para a tela de Termos que já criamos!
            />

            {/* Versão do App (Rodapé da Seção) */}
            <View
              style={[
                styles.versaoContainer,
                { backgroundColor: cardColor },
              ]}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: isDark
                        ? '#202020'
                        : '#F0F0F0',
                    },
                  ]}
                >
                  <Info size={20} color="#00C853" />
                </View>
                <View>
                  <Text
                    style={[
                      styles.itemTitle,
                      {
                        color: isDark
                          ? '#FFFFFF'
                          : '#1A1A1A',
                      },
                    ]}
                  >
                    Versão do Aplicativo
                  </Text>
                  <Text
                    style={[
                      styles.itemSubtitle,
                      { color: textMuted },
                    ]}
                  >
                    v1.0.4 Build Final
                  </Text>
                </View>
              </View>
              <Text style={styles.versaoBadge}>
                Atualizado
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
