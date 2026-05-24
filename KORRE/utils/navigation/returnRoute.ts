import type { Href } from 'expo-router';

type RouterWithBack = {
  back: () => void;
  canGoBack?: () => boolean;
  replace: (href: Href) => void;
};

let returnRoute: Href | null = null;

/**
 * Executa a função de set return route.
 */
export const setReturnRoute = (route: Href) => {
  returnRoute = route;
};

/**
 * Executa a função de get return route.
 */
export const getReturnRoute = () => returnRoute;

/**
 * Executa a função de clear return route.
 */
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

