import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  SafeAreaView, // <-- Importado para respeitar a área segura da tela
  Platform, // <-- Importado para saber se é Android ou iOS
  StatusBar, // <-- Importado para pegar o tamanho da barra de status
} from 'react-native';
import {
  ArrowLeft,
  Youtube,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTema } from '../../hooks/modo_tema';
import { showCustomAlert } from '../../hooks/alert/useCustomAlert';

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
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  const bgColor = isDark ? '#0A0A0A' : '#F5F5F5';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const cardColor = isDark ? '#161616' : '#FFFFFF';
  const borderColor = isDark ? '#222' : '#E0E0E0';

  // Links
  const abrirYouTube = () => {
    Linking.openURL(
      'https://youtube.com/@SeuCanalMotoboy',
    ).catch(() => {
      showCustomAlert(
        'Erro',
        'Não foi possível abrir o YouTube.',
      );
    });
  };

  const abrirWhatsApp = () => {
    const numero = '5511999999999';
    const mensagem =
      'Olá! Preciso de ajuda com o aplicativo.';
    Linking.openURL(
      `whatsapp://send?phone=${numero}&text=${encodeURIComponent(mensagem)}`,
    ).catch(() => {
      showCustomAlert(
        'Erro',
        'WhatsApp não está instalado neste dispositivo.',
      );
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          // Adiciona o espaçamento no topo para não ficar atrás da hora/bateria
          paddingTop:
            Platform.OS === 'android'
              ? StatusBar.currentHeight
              : 0,
        },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            borderBottomColor: borderColor,
            // Um pequeno respiro extra no topo para ficar mais elegante
            marginTop: 10,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            // <-- Aqui definimos o roteamento direto para a tela de Perfil
            onPress={() => router.push('/perfil')}
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
            Ajuda e Suporte
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner do YouTube */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={abrirYouTube}
          style={styles.bannerYoutube}
        >
          <Youtube
            size={40}
            color="#FFFFFF"
            style={styles.youtubeIcon}
          />
          <View style={styles.youtubeTextContainer}>
            <Text style={styles.youtubeTitle}>
              Tutoriais em Vídeo
            </Text>
            <Text style={styles.youtubeSubtitle}>
              Aprende a usar todas as funções do app passo a
              passo no nosso canal.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Secção de Contacto Direto */}
        <Text style={styles.sectionTitle}>
          Precisa de Falar Connosco?
        </Text>
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
              Suporte via WhatsApp
            </Text>
            <Text style={styles.whatsappSubtitle}>
              Resposta em até 24 horas
            </Text>
          </View>
        </TouchableOpacity>

        {/* Secção de FAQ */}
        <Text style={styles.sectionTitle}>
          Perguntas Frequentes
        </Text>

        <FAQItem
          isDark={isDark}
          pergunta="Como alterar a minha meta diária?"
          resposta="Vai à aba 'Perfil' e clica no cartão da 'Meta Financeira'. Podes digitar um novo valor e confirmar clicando no botão verde de check."
        />
        <FAQItem
          isDark={isDark}
          pergunta="Os meus dados estão seguros?"
          resposta="Sim! Todo o teu histórico financeiro e dados de veículos ficam guardados exclusivamente no teu telemóvel (offline). Nós não temos acesso aos teus ganhos."
        />
        <FAQItem
          isDark={isDark}
          pergunta="Como registar a troca de óleo?"
          resposta="Acede à secção 'Oficina/Garagem', seleciona a tua mota, e vai à aba de Manutenção. Lá podes adicionar o serviço de troca de óleo e o sistema avisar-te-á quando for a hora de trocar novamente."
        />
        <FAQItem
          isDark={isDark}
          pergunta="Posso usar o app sem internet?"
          resposta="Com certeza. O app foi feito a pensar em quem está na rua. Podes registar os teus ganhos e despesas totalmente offline."
        />

        {/* Links Adicionais */}
        <TouchableOpacity
          style={styles.footerLinkBox}
          onPress={() => router.push('/termos')} // <-- Adicione esta linha!
        >
          <FileText
            size={16}
            color="#888"
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>
            Termos de Uso e Privacidade
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
