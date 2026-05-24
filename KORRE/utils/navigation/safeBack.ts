import type { Href } from 'expo-router';
import { AppRoutes } from '../../constants/routes';

type RouterWithBack = {
  back: () => void;
  canGoBack?: () => boolean;
  replace: (href: Href) => void;
};

export const safeBack = (
  router: RouterWithBack,
  fallback: Href = AppRoutes.login,
) => {
  if (router.canGoBack?.()) {
    router.back();
    return;
  }

  router.replace(fallback);
};
