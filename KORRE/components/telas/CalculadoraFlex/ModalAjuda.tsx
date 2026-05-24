import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTema } from '../../../hooks/modo_tema';

import { styles } from '../../../styles/generated/components/telas/CalculadoraFlex/ModalAjudaStyles';
import { inlineStyles } from '../../../styles/generated-inline/components/telas/CalculadoraFlex/ModalAjudaInlineStyles';

/**
 * Executa a função de modal ajuda.
 */
export default function ModalAjuda({
  modalAjuda,
  setModalAjuda,
}: {
  modalAjuda: boolean;
  setModalAjuda: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}) {
  const { t } = useTranslation();
  const { tema } = useTema();
  const isDark = tema === 'escuro';

  return (
    <Modal
      visible={modalAjuda}
      animationType="fade"
      transparent
      onRequestClose={() => setModalAjuda(false)}
    >
      <View
        style={[
          styles.modalOverlay,
          {
            backgroundColor: isDark
              ? 'rgba(0,0,0,0.97)'
              : 'rgba(255,255,255,0.95)',
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[
              styles.modalCloseBtn,
              {
                backgroundColor: isDark ? '#161616' : '#FFFFFF',
                borderColor: isDark ? '#222' : '#E0E0E0',
              },
            ]}
            onPress={() => setModalAjuda(false)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="close"
              size={24}
              color={isDark ? '#666' : '#333'}
            />
          </TouchableOpacity>

          <View style={styles.modalHeader}>
            <View style={styles.modalIconWrap}>
              <Ionicons
                name="calculator"
                size={40}
                color="#00C853"
              />
            </View>
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? '#fff' : '#000' },
              ]}
            >
              {t('flex_calc.help.title')}
            </Text>
            <Text style={styles.modalSubtitle}>
              {t('flex_calc.help.subtitle')}
            </Text>
          </View>

          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: isDark ? '#161616' : '#FFFFFF',
                borderColor: isDark ? '#222' : '#E0E0E0',
              },
            ]}
          >
            <View style={styles.modalCardHeader}>
              <MaterialCommunityIcons
                name="flask"
                size={20}
                color="#EAB308"
              />
              <Text
                style={[
                  styles.modalCardTitle,
                  { color: '#EAB308' },
                ]}
              >
                {t('flex_calc.help.topic1_title')}
              </Text>
            </View>
            <Text
              style={[
                styles.modalCardText,
                { color: isDark ? '#888' : '#555' },
              ]}
            >
              {t('flex_calc.help.topic1_text_before')}{' '}
              <Text
                style={[
                  styles.highlight,
                  { color: isDark ? '#fff' : '#000' },
                ]}
              >
                {t('flex_calc.help.topic1_highlight')}
              </Text>{' '}
              {t('flex_calc.help.topic1_text_after')}
            </Text>
          </View>

          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: isDark ? '#161616' : '#FFFFFF',
                borderColor: isDark ? '#222' : '#E0E0E0',
              },
            ]}
          >
            <View style={styles.modalCardHeader}>
              <Ionicons
                name="flash"
                size={20}
                color="#00C853"
              />
              <Text
                style={[
                  styles.modalCardTitle,
                  { color: '#00C853' },
                ]}
              >
                {t('flex_calc.help.topic2_title')}
              </Text>
            </View>
            <Text
              style={[
                styles.modalCardText,
                { color: isDark ? '#888' : '#555' },
              ]}
            >
              {t('flex_calc.help.topic2_text')}
            </Text>
          </View>

          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: isDark ? '#161616' : '#FFFFFF',
                borderColor: isDark ? '#222' : '#E0E0E0',
              },
            ]}
          >
            <View style={styles.modalCardHeader}>
              <Ionicons
                name="speedometer"
                size={20}
                color="#3B82F6"
              />
              <Text
                style={[
                  styles.modalCardTitle,
                  { color: '#3B82F6' },
                ]}
              >
                {t('flex_calc.help.topic3_title')}
              </Text>
            </View>
            <Text
              style={[
                styles.modalCardText,
                {
                  marginBottom: 12,
                  color: isDark ? '#888' : '#555',
                },
              ]}
            >
              {t('flex_calc.help.topic3_text')}
            </Text>
            <View
              style={[
                styles.stepsBox,
                {
                  backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5',
                  borderColor: isDark ? '#222' : '#E0E0E0',
                },
              ]}
            >
              <Text
                style={[
                  styles.stepText,
                  { color: isDark ? '#fff' : '#000' },
                ]}
              >
                {t('flex_calc.help.step1')}
              </Text>
              <Text
                style={[
                  styles.stepText,
                  { color: isDark ? '#fff' : '#000' },
                ]}
              >
                {t('flex_calc.help.step2')}
              </Text>
              <Text
                style={[
                  styles.stepText,
                  { color: isDark ? '#fff' : '#000' },
                ]}
              >
                {t('flex_calc.help.step3_before')}{' '}
                <Text style={inlineStyles.inline1}>
                  {t('flex_calc.help.step3_formula')}
                </Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.modalCta}
            onPress={() => setModalAjuda(false)}
            activeOpacity={0.85}
          >
            <Text style={styles.modalCtaText}>
              {t('flex_calc.help.cta')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
