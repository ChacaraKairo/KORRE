import {
  ExternalLink,
  Globe,
  Instagram,
  MessageCircle,
} from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COMPANY_CONTACTS } from '../config/companyContacts';
import { showCustomAlert } from '../hooks/alert/useCustomAlert';

type OfficialLinksBannerProps = {
  isDark?: boolean;
  compact?: boolean;
};

const openExternalUrl = (url: string, errorMessage: string) => {
  if (!url) return;

  Linking.openURL(url).catch(() => {
    showCustomAlert('KORRE', errorMessage);
  });
};

export const OfficialLinksBanner = ({
  isDark = true,
  compact = false,
}: OfficialLinksBannerProps) => {
  const { t } = useTranslation();
  const cardBg = isDark ? '#161616' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#101010';
  const mutedColor = isDark ? '#9A9A9A' : '#555555';
  const borderColor = isDark ? '#242424' : '#E0E0E0';

  const links = [
    {
      key: 'community',
      label: t('links.community_short'),
      url: COMPANY_CONTACTS.support.whatsappCommunityUrl,
      icon: MessageCircle,
      error: t('links.community_error'),
    },
    {
      key: 'instagram',
      label: t('links.instagram_short'),
      url: COMPANY_CONTACTS.support.instagramUrl,
      icon: Instagram,
      error: t('links.instagram_error'),
    },
    {
      key: 'site',
      label: t('links.site_short'),
      url: COMPANY_CONTACTS.app.websiteUrl,
      icon: Globe,
      error: t('links.site_error'),
    },
  ].filter((link) => Boolean(link.url));

  if (links.length === 0) return null;

  return (
    <View
      style={[
        styles.card,
        compact && styles.cardCompact,
        { backgroundColor: cardBg, borderColor },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconBox, compact && styles.iconBoxCompact]}>
          <ExternalLink size={18} color="#00C853" />
        </View>
        <View style={styles.copy}>
          <Text
            style={[
              styles.title,
              compact && styles.titleCompact,
              { color: textColor },
            ]}
            numberOfLines={1}
          >
            {t('links.official_title')}
          </Text>
          {!compact && (
            <Text
              style={[styles.subtitle, { color: mutedColor }]}
              numberOfLines={2}
            >
              {t('links.official_subtitle')}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <TouchableOpacity
              key={link.key}
              style={[
                styles.actionButton,
                compact && styles.actionButtonCompact,
              ]}
              activeOpacity={0.82}
              onPress={() => openExternalUrl(link.url, link.error)}
            >
              <Icon size={16} color="#06140C" />
              <Text style={styles.actionText} numberOfLines={1}>
                {link.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    gap: 14,
  },
  cardCompact: {
    padding: 12,
    marginBottom: 14,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 200, 83, 0.12)',
  },
  iconBoxCompact: {
    width: 32,
    height: 32,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  titleCompact: {
    fontSize: 12,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexGrow: 1,
    flexBasis: 96,
    minHeight: 38,
    borderRadius: 8,
    backgroundColor: '#00C853',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 8,
  },
  actionButtonCompact: {
    minHeight: 34,
  },
  actionText: {
    flexShrink: 1,
    color: '#06140C',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
