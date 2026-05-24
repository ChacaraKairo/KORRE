import { InteractionManager } from 'react-native';
import { create } from 'zustand';

interface AppLoadingState {
  visible: boolean;
  message: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

export const useAppLoading = create<AppLoadingState>((set) => ({
  visible: false,
  message: 'Carregando...',
  showLoading: (message = 'Carregando...') =>
    set({ visible: true, message }),
  hideLoading: () => set({ visible: false }),
}));

/**
 * Executa a função de show app loading.
 */
export const showAppLoading = (message?: string) => {
  useAppLoading.getState().showLoading(message);
};

/**
 * Executa a função de wait for app loading frame.
 */
export const waitForAppLoadingFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        InteractionManager.runAfterInteractions(() => {
          setTimeout(resolve, 180);
        });
      }),
    );
  });

/**
 * Executa a função de show app loading async.
 */
export const showAppLoadingAsync = async (message?: string) => {
  showAppLoading(message);
  await waitForAppLoadingFrame();
};

/**
 * Executa a função de hide app loading.
 */
export const hideAppLoading = () => {
  useAppLoading.getState().hideLoading();
};
