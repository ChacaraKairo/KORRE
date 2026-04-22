import { create } from 'zustand';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  buttons: AlertButton[];
  showAlert: (
    title: string,
    message: string,
    buttons?: AlertButton[],
  ) => void;
  hideAlert: () => void;
}

export const useCustomAlert = create<AlertState>((set) => ({
  visible: false,
  title: '',
  message: '',
  buttons: [],
  showAlert: (title, message, buttons) =>
    set({
      visible: true,
      title,
      message,
      buttons: buttons || [{ text: 'OK' }],
    }),
  hideAlert: () => set({ visible: false }),
}));

// Helper para facilitar a importação e o uso dentro de outros Hooks ou Funções soltas
export const showCustomAlert = (
  title: string,
  message: string,
  buttons?: AlertButton[],
) => {
  useCustomAlert
    .getState()
    .showAlert(title, message, buttons);
};
