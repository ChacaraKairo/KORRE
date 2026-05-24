import { useEffect, useState } from 'react';

export type CondicaoClima = 'sol' | 'nublado' | 'chuva';

interface ClimaInfo {
  min: number;
  max: number;
  condicao: CondicaoClima;
  horaChuva?: string;
  probabilidadeChuva?: number;
}

const DEFAULT_COORDS = {
  lat: -23.5505,
  lon: -46.6333,
};

/**
 * Executa a função de use header clima dashboard.
 */
export const useHeaderClimaDashboard = () => {
  const [clima, setClima] = useState<ClimaInfo | null>(
    null,
  );
  const [loadingClima, setLoadingClima] = useState(true);

  useEffect(() => {
    /**
     * Executa a função de fetch clima.
     */
    const fetchClima = async () => {
      try {
        const { lat, lon } = DEFAULT_COORDS;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=2`;

        const response = await fetch(url);
        const data = await response.json();

        const max = Math.round(
          data.daily.temperature_2m_max[1],
        );
        const min = Math.round(
          data.daily.temperature_2m_min[1],
        );
        const dailyCode = data.daily.weather_code[1];

        let condicao: CondicaoClima = 'sol';
        if (dailyCode > 0 && dailyCode <= 48)
          condicao = 'nublado';
        if (dailyCode >= 51) condicao = 'chuva';

        let horaChuva = undefined;
        let probabilidadeChuva = undefined;

        if (condicao === 'chuva') {
          for (let i = 24; i < 48; i++) {
            if (
              data.hourly.precipitation_probability[i] >
                40 ||
              data.hourly.weather_code[i] >= 51
            ) {
              const dataHora = new Date(
                data.hourly.time[i],
              );
              horaChuva = `${String(dataHora.getHours()).padStart(2, '0')}h`;
              probabilidadeChuva =
                data.hourly.precipitation_probability[i];
              break;
            }
          }
        }

        setClima({
          min,
          max,
          condicao,
          horaChuva,
          probabilidadeChuva,
        });
      } catch (error) {
        console.error(
          'Erro ao buscar previsao do tempo:',
          error,
        );
      } finally {
        setLoadingClima(false);
      }
    };

    fetchClima();
  }, []);

  return { clima, loadingClima };
};
