import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  Check,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { showCustomAlert } from '../../hooks/alert/useCustomAlert';

// Lógica e Estilos
import { useTema } from '../../hooks/modo_tema';
import { styles } from '../../styles/telas/Configuracoes/configuracoesStyles';

// Componentes
import { SettingItem } from '../../components/telas/Configuracoes/SettingItem';

export default function ConfiguracoesScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  // Usando o seu Hook global de Tema
  const { tema, setTema } = useTema();
  const isDark = tema === 'escuro';

  // Estados locais para outras configurações
  const [notificacoes, setNotificacoes] = useState(true);
  const [modalIdioma, setModalIdioma] = useState(false);

  // Cores dinâmicas para a base da tela
  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';
  const textMuted = isDark ? '#666' : '#888';

  // Mapeamento dos idiomas disponíveis
  const idiomas = [
    { code: 'pt', label: 'Português (PT)' },
    { code: 'en', label: 'English (EN)' },
    { code: 'es', label: 'Español (ES)' },
    { code: 'fr', label: 'Français (FR)' },
  ];

  const getIdiomaAtual = () => {
    const lang = idiomas.find(
      (l) => l.code === i18n.language,
    );
    return lang ? lang.label : 'Português (PT)';
  };

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
          {t('configuracoes.titulo')}
        </Text>
        <View style={{ width: 36 }} />
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
            {t('configuracoes.aparencia')}
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
              title={t('configuracoes.modo_visualizacao')}
              subtitle={
                isDark
                  ? t('configuracoes.escuro')
                  : t('configuracoes.claro')
              }
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
              title={t('configuracoes.notificacoes')}
              subtitle={t('configuracoes.notificacoes_sub')}
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
            {t('configuracoes.regional')}
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
              title={t('configuracoes.idioma')}
              subtitle={t('configuracoes.idioma_sub')}
              value={{ label: getIdiomaAtual() }}
              onClick={() => setModalIdioma(true)}
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
            {t('configuracoes.privacidade')}
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
              title={t('configuracoes.privacidade_dados')}
              subtitle={t('configuracoes.privacidade_sub')}
              value={{ label: t('configuracoes.ver') }}
              onClick={() =>
                showCustomAlert(
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
            {t('configuracoes.suporte')}
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
              title={t('configuracoes.central_ajuda')}
              subtitle={t(
                'configuracoes.central_ajuda_sub',
              )}
              onClick={() => router.push('/suporte')} // Link para a tela de Suporte que já criamos!
            />
            <SettingItem
              isDark={isDark}
              icon={FileText}
              title={t('configuracoes.termos')}
              subtitle={t('configuracoes.termos_sub')}
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
                    {t('configuracoes.versao')}
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
                {t('configuracoes.atualizado')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* MODAL DE IDIOMA */}
      <Modal
        visible={modalIdioma}
        transparent
        animationType="fade"
        onRequestClose={() => setModalIdioma(false)}
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
              {t('configuracoes.selecione_idioma')}
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
                  alignItems: 'center',
                }}
                onPress={() => {
                  i18n.changeLanguage(lang.code);
                  setModalIdioma(false);
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
                    fontWeight:
                      i18n.language === lang.code
                        ? 'bold'
                        : 'normal',
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
              onPress={() => setModalIdioma(false)}
            >
              <Text
                style={{
                  color: '#0A0A0A',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                {t('configuracoes.cancelar')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
