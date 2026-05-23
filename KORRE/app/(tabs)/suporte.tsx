import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileText,
  Globe,
  Mail,
  MessageCircle,
  Youtube,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COMPANY_CONTACTS } from '../../config/companyContacts';
import { AppRoutes } from '../../constants/routes';
import { showCustomAlert } from '../../hooks/alert/useCustomAlert';
import { useTema } from '../../hooks/modo_tema';
import { safeBack } from '../../utils/navigation/safeBack';

import { styles } from '../../styles/telas/Suporte/suporteStyles';

const FAQItem = ({
  pergunta,
  resposta,
  isDark,
}: {
  pergunta: string;
  resposta: string;
  isDark: boolean;
}) => {
  const [aberto, setAberto] = useState(false);
  const bgColor = isDark ? '#161616' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const borderColor = isDark ? '#222' : '#E0E0E0';

  return (
    <View
      style={[
        styles.faqContainer,
        { backgroundColor: bgColor, borderColor },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setAberto(!aberto)}
        style={styles.faqHeader}
      >
        <Text
          style={[styles.faqQuestion, { color: textColor }]}
        >
          {pergunta}
        </Text>
        {aberto ? (
          <ChevronUp size={20} color="#00C853" />
        ) : (
          <ChevronDown size={20} color="#666" />
        )}
      </TouchableOpacity>

      {aberto && (
        <View style={styles.faqAnswerBox}>
          <Text
            style={[
              styles.faqAnswer,
              { color: isDark ? '#AAA' : '#555' },
            ]}
          >
            {resposta}
          </Text>
        </View>
      )}
    </View>
  );
};

export default function SuporteScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';

  const hasWhatsapp = Boolean(
    COMPANY_CONTACTS.support.whatsappNumber,
  );
  const hasYoutube = Boolean(COMPANY_CONTACTS.support.youtubeUrl);
  const hasEmail = Boolean(COMPANY_CONTACTS.support.email);
  const hasSupportWebsite = Boolean(
    COMPANY_CONTACTS.support.websiteUrl,
  );
  const hasAppWebsite = Boolean(COMPANY_CONTACTS.app.websiteUrl);
  const hasComplaints = Boolean(
    COMPANY_CONTACTS.support.complaintsUrl,
  );
  const hasPrivacyPolicy = Boolean(
    COMPANY_CONTACTS.support.privacyPolicyUrl,
  );
  const hasAnyChannel =
    hasWhatsapp ||
    hasYoutube ||
    hasEmail ||
    hasSupportWebsite ||
    hasAppWebsite ||
    hasComplaints ||
    hasPrivacyPolicy;

  const showChannelNotConfigured = () => {
    showCustomAlert(
      t('suporte.canal_nao_configurado_titulo'),
      t('suporte.canal_nao_configurado_msg'),
    );
  };

  const openExternalUrl = async (url: string, errorMessage: string) => {
    if (!url) {
      showChannelNotConfigured();
      return;
    }

    Linking.openURL(url).catch(() => {
      showCustomAlert(t('common.erro'), errorMessage);
    });
  };

  const abrirWhatsApp = () => {
    const phone = COMPANY_CONTACTS.support.whatsappNumber;
    if (!phone) {
      showChannelNotConfigured();
      return;
    }

    const message = COMPANY_CONTACTS.support.whatsappMessage;
    void openExternalUrl(
      `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`,
      t('suporte.whatsapp_erro'),
    );
  };

  const abrirEmail = () => {
    const email = COMPANY_CONTACTS.support.email;
    if (!email) {
      showChannelNotConfigured();
      return;
    }

    void openExternalUrl(
      `mailto:${email}?subject=${encodeURIComponent(t('suporte.email_assunto'))}`,
      t('suporte.email_erro'),
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          paddingTop:
            Platform.OS === 'android'
              ? StatusBar.currentHeight
              : 0,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            borderBottomColor: borderColor,
            marginTop: 10,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => safeBack(router, AppRoutes.perfil)}
            style={[
              styles.btnVoltar,
              { backgroundColor: cardColor },
            ]}
          >
            <ArrowLeft size={20} color={textColor} />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { color: textColor },
            ]}
          >
            {t('suporte.titulo')}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {hasSupportWebsite && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              void openExternalUrl(
                COMPANY_CONTACTS.support.websiteUrl,
                t('suporte.site_koru_erro'),
              )
            }
            style={[
              styles.companyCard,
              { backgroundColor: cardColor, borderColor },
            ]}
          >
            <Image
              source={require('../../assets/images/koru.png')}
              style={styles.companyLogo}
              resizeMode="contain"
            />
            <View style={styles.companyTextContainer}>
              <Text
                style={[
                  styles.companyEyebrow,
                  { color: isDark ? '#AAA' : '#555' },
                ]}
              >
                {t('suporte.suporte_por')}
              </Text>
              <Text style={[styles.companyTitle, { color: textColor }]}>
                {COMPANY_CONTACTS.companyName}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {hasYoutube && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              void openExternalUrl(
                COMPANY_CONTACTS.support.youtubeUrl,
                t('suporte.youtube_erro'),
              )
            }
            style={styles.bannerYoutube}
          >
            <Youtube
              size={40}
              color="#FFFFFF"
              style={styles.youtubeIcon}
            />
            <View style={styles.youtubeTextContainer}>
              <Text style={styles.youtubeTitle}>
                {t('suporte.youtube')}
              </Text>
              <Text style={styles.youtubeSubtitle}>
                {t('suporte.tutoriais_sub')}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>
          {t('suporte.contato')}
        </Text>

        {!hasAnyChannel && (
          <View
            style={[
              styles.faqContainer,
              { backgroundColor: cardColor, borderColor },
            ]}
          >
            <Text
              style={[
                styles.faqAnswer,
                { color: isDark ? '#AAA' : '#555' },
              ]}
            >
              {t('suporte.canais_indisponiveis')}
            </Text>
          </View>
        )}

        {hasAppWebsite && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              void openExternalUrl(
                COMPANY_CONTACTS.app.websiteUrl,
                t('suporte.site_app_erro'),
              )
            }
            style={[
              styles.cardWhatsapp,
              { backgroundColor: cardColor, borderColor },
            ]}
          >
            <View style={styles.whatsappIconBox}>
              <Globe size={24} color="#00C853" />
            </View>
            <View style={styles.whatsappTextContainer}>
              <Text
                style={[
                  styles.whatsappTitle,
                  { color: textColor },
                ]}
              >
                {t('suporte.site_app')}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {hasWhatsapp && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={abrirWhatsApp}
            style={[
              styles.cardWhatsapp,
              { backgroundColor: cardColor, borderColor },
            ]}
          >
            <View style={styles.whatsappIconBox}>
              <MessageCircle size={24} color="#00C853" />
            </View>
            <View style={styles.whatsappTextContainer}>
              <Text
                style={[
                  styles.whatsappTitle,
                  { color: textColor },
                ]}
              >
                {t('suporte.whatsapp')}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {hasEmail && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={abrirEmail}
            style={[
              styles.cardWhatsapp,
              { backgroundColor: cardColor, borderColor },
            ]}
          >
            <View style={styles.whatsappIconBox}>
              <Mail size={24} color="#00C853" />
            </View>
            <View style={styles.whatsappTextContainer}>
              <Text
                style={[
                  styles.whatsappTitle,
                  { color: textColor },
                ]}
              >
                {t('suporte.email')}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {hasComplaints && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              void openExternalUrl(
                COMPANY_CONTACTS.support.complaintsUrl,
                t('suporte.reclamacoes_erro'),
              )
            }
            style={[
              styles.cardWhatsapp,
              { backgroundColor: cardColor, borderColor },
            ]}
          >
            <View style={styles.whatsappIconBox}>
              <AlertTriangle size={24} color="#00C853" />
            </View>
            <View style={styles.whatsappTextContainer}>
              <Text
                style={[
                  styles.whatsappTitle,
                  { color: textColor },
                ]}
              >
                {t('suporte.reclamacoes')}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {hasPrivacyPolicy && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              void openExternalUrl(
                COMPANY_CONTACTS.support.privacyPolicyUrl,
                t('suporte.privacidade_erro'),
              )
            }
            style={[
              styles.cardWhatsapp,
              { backgroundColor: cardColor, borderColor },
            ]}
          >
            <View style={styles.whatsappIconBox}>
              <FileText size={24} color="#00C853" />
            </View>
            <View style={styles.whatsappTextContainer}>
              <Text
                style={[
                  styles.whatsappTitle,
                  { color: textColor },
                ]}
              >
                {t('suporte.politica_privacidade')}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>
          {t('suporte.faq')}
        </Text>

        <FAQItem
          isDark={isDark}
          pergunta={t('suporte.faq_meta_pergunta')}
          resposta={t('suporte.faq_meta_resposta')}
        />
        <FAQItem
          isDark={isDark}
          pergunta={t('suporte.faq_dados_pergunta')}
          resposta={t('suporte.faq_dados_resposta')}
        />
        <FAQItem
          isDark={isDark}
          pergunta={t('suporte.faq_manutencao_pergunta')}
          resposta={t('suporte.faq_manutencao_resposta')}
        />
        <FAQItem
          isDark={isDark}
          pergunta={t('suporte.faq_offline_pergunta')}
          resposta={t('suporte.faq_offline_resposta')}
        />

        <TouchableOpacity
          style={styles.footerLinkBox}
          onPress={() => router.push(AppRoutes.termos)}
        >
          <FileText
            size={16}
            color="#888"
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>
            {t('suporte.termos_privacidade')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
