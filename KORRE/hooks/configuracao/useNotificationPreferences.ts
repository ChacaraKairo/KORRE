import { useCallback, useEffect, useState } from 'react';
import {
  NotificationPreferencesService,
  type NotificationPreferences,
} from '../../notifications/NotificationPreferencesService';

/**
 * Executa a função de use notification preferences.
 */
export function useNotificationPreferences() {
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(
    null,
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const value =
        await NotificationPreferencesService.getPreferences();
      setPrefs(value);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setPref = useCallback(
    async (key: keyof NotificationPreferences, value: boolean) => {
      await NotificationPreferencesService.setPreference(key, value);
      await load();
    },
    [load],
  );

  return { loading, prefs, setPref };
}
