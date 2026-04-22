// MeuCorre/constants/theme.ts
import { Platform } from 'react-native';

// Cores base (Brand Colors)
const brand = {
  verde: '#00C853',
  verdeClaro: '#00E676',
  verdeEscuro: '#007A33',
  laranja: '#F97316',
  amarelo: '#FBBF24',
  vermelho: '#EF4444',
  azul: '#0A7EA4',
};

export const Colors = {
  light: {
    // Cores Principais
    primary: brand.verde,
    text: '#11181C',
    textSecondary: '#687076',
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',

    // UI Elements
    tint: brand.verde,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: brand.verde,
    border: '#E0E0E0',
    card: '#FFFFFF',

    // Status (Útil para sua Oficina e Financeiro)
    success: brand.verde,
    warning: brand.amarelo,
    danger: brand.vermelho,
    info: brand.azul,
    initial: brand.laranja,
  },
  dark: {
    // Cores Principais
    primary: brand.verde,
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#0A0A0A',
    backgroundSecondary: '#161616',

    // UI Elements
    tint: '#FFFFFF',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFFFFF',
    border: '#222222',
    card: '#161616',

    // Status
    success: brand.verdeClaro,
    warning: brand.amarelo,
    danger: brand.vermelho,
    info: brand.azul,
    initial: brand.laranja,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System', // iOS suporta rounded nativamente via UIFontDescriptor
    mono: 'Courier',
  },
  android: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif', // Android usa sans-serif por padrão
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});
