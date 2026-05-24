import { useCallback, useRef, useState } from 'react';

export interface BackupPasswordPromptState {
  visible: boolean;
  title: string;
  message?: string;
}

/**
 * Executa a função de use backup password prompt.
 */
export const useBackupPasswordPrompt = () => {
  const [state, setState] = useState<BackupPasswordPromptState>({
    visible: false,
    title: '',
  });
  const resolverRef = useRef<((value: string | null) => void) | null>(
    null,
  );

  const requestPassword = useCallback(
    (title: string, message?: string) =>
      new Promise<string | null>((resolve) => {
        resolverRef.current = resolve;
        setState({ visible: true, title, message });
      }),
    [],
  );

  const submitPassword = useCallback((password: string) => {
    resolverRef.current?.(password);
    resolverRef.current = null;
    setState((current) => ({ ...current, visible: false }));
  }, []);

  const cancelPassword = useCallback(() => {
    resolverRef.current?.(null);
    resolverRef.current = null;
    setState((current) => ({ ...current, visible: false }));
  }, []);

  return {
    backupPasswordPrompt: state,
    requestPassword,
    submitPassword,
    cancelPassword,
  };
};
