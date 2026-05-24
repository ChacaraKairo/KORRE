/**
 * Executa a função de wait for ui feedback.
 */
export const waitForUiFeedback = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 0);
    });
  });
