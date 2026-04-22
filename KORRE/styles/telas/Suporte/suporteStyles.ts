import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    paddingHorizontal: 20, // Adicionado para manter o alinhamento
    paddingTop: 10,
    marginTop: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  btnVoltar: {
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Banner YouTube
  bannerYoutube: {
    backgroundColor: '#FF0000',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  youtubeIcon: {
    marginRight: 16,
  },
  youtubeTextContainer: {
    flex: 1,
  },
  youtubeTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  youtubeSubtitle: {
    color: '#FFEBEB',
    fontSize: 12,
  },

  // Títulos das secções
  sectionTitle: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },

  // Card WhatsApp
  cardWhatsapp: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  whatsappIconBox: {
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  whatsappTextContainer: {
    flex: 1,
  },
  whatsappTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  whatsappSubtitle: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },

  // FAQ Item
  faqContainer: {
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
    paddingRight: 10,
  },
  faqAnswerBox: {
    padding: 16,
    paddingTop: 0,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Footer Links
  footerLinkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    padding: 16,
  },
  footerIcon: {
    marginRight: 8,
  },
  footerText: {
    color: '#888',
    textDecorationLine: 'underline',
  },
});
