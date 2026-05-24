import type { Href } from 'expo-router';

type RouterWithBack = {
  back: () => void;
  canGoBack?: () => boolean;
  replace: (href: Href) => void;
};

let returnRoute: Href | null = null;

export const setReturnRoute = (route: Href) => {
  returnRoute = route;
};

export const getReturnRoute = () => returnRoute;

export const clearReturnRoute = () => {
  returnRoute = null;
};

export const goBackToReturnRoute = (
  router: RouterWithBack,
  fallback: Href,
) => {
  const target = getReturnRoute();
  if (target) {
    clearReturnRoute();
    router.replace(target);
    return;
  }

  if (router.canGoBack?.()) {
    router.back();
    return;
  }

  router.replace(fallback);
};

