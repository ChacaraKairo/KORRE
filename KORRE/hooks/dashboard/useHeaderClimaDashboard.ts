import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

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
        // Coordenadas padrão (Ex: São Paulo) como fallback
        let lat = -23.5505;
        let lon = -46.6333;

        try {
          const { status } =
            await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const location =
              await Location.getCurrentPositionAsync({});
            lat = location.coords.latitude;
            lon = location.coords.longitude;

            // Realiza a geocodificação reversa para descobrir a cidade, estado e país
            const geocodeResult =
              await Location.reverseGeocodeAsync({
                latitude: lat,
                longitude: lon,
              });
            if (geocodeResult && geocodeResult.length > 0) {
              const endereco = geocodeResult[0];
              console.log(
                `🌍 [GEO LOG] Lat: ${lat}, Lon: ${lon} | Cidade: ${endereco.city || endereco.subregion}, Estado: ${endereco.region}, País: ${endereco.country}`,
              );
            } else {
              console.log(
                `🌍 [GEO LOG] Lat: ${lat}, Lon: ${lon} | Endereço não encontrado.`,
              );
            }
          }
        } catch (locationError) {
          console.warn(
            'Não foi possível obter a localização. Usando padrão.',
            locationError,
          );
        }

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
