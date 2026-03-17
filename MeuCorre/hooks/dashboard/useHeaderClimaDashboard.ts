import { useState, useEffect } from 'react';

export type CondicaoClima = 'sol' | 'nublado' | 'chuva';

interface ClimaInfo {
  min: number;
  max: number;
  condicao: CondicaoClima;
  horaChuva?: string;
  probabilidadeChuva?: number;
}

export const useHeaderClimaDashboard = () => {
  const [clima, setClima] = useState<ClimaInfo | null>(
    null,
  );
  const [loadingClima, setLoadingClima] = useState(true);

  useEffect(() => {
    const fetchClima = async () => {
      try {
        // Coordenadas padrão (Ex: São Paulo).
        // No futuro, pode substituir por expo-location para obter a localização real do utilizador.
        const lat = -23.5505;
        const lon = -46.6333;

        // Busca previsão diária e horária para 2 dias (hoje e amanhã) usando fuso horário local
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=2`;

        const response = await fetch(url);
        const data = await response.json();

        // Índices: 0 é hoje, 1 é amanhã
        const max = Math.round(
          data.daily.temperature_2m_max[1],
        );
        const min = Math.round(
          data.daily.temperature_2m_min[1],
        );
        const dailyCode = data.daily.weather_code[1]; // Código WMO da Organização Meteorológica Mundial

        // Determina a condição geral de amanhã
        let condicao: CondicaoClima = 'sol';
        if (dailyCode > 0 && dailyCode <= 48)
          condicao = 'nublado'; // Códigos de nuvens/nevoeiro
        if (dailyCode >= 51) condicao = 'chuva'; // Códigos de chuva/tempestade

        let horaChuva = undefined;
        let probabilidadeChuva = undefined;

        // Se for chover amanhã, varre as horas (índices 24 a 47) para descobrir a que horas começa
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
              break; // Pára no primeiro horário com chuva significativa
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
          'Erro ao buscar previsão do tempo:',
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
