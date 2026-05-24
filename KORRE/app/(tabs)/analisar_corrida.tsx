import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppRoutes } from '../../constants/routes';
import { useTema } from '../../hooks/modo_tema';
import { useRideDecision } from '../../modules/rideDecision/hooks/useRideDecision';

const formatCurrency = (value: number) =>
  `R$ ${value.toFixed(2).replace('.', ',')}`;

export default function AnalisarCorridaScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const {
    analisar,
    analiseSalva,
    historico,
    indicesConfigurados,
    kmEmbarque,
    kmViagem,
    loading,
    resultado,
    salvando,
    salvarAnalise,
    setKmEmbarque,
    setKmViagem,
    setTempoTotal,
    setValorOferta,
    tempoTotal,
    valorOferta,
  } = useRideDecision();

  const bg = isDark ? '#0A0A0A' : '#F5F5F5';
  const cardBg = isDark ? '#161616' : '#FFFFFF';
  const text = isDark ? '#FFFFFF' : '#111827';
  const muted = isDark ? '#9CA3AF' : '#4B5563';
  const border = isDark ? '#262626' : '#E5E7EB';

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg,
        }}
      >
        <ActivityIndicator color="#00C853" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        gap: 14,
        padding: 18,
        backgroundColor: bg,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: '#00C853', fontWeight: '900' }}>
          {t('common.voltar')}
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          color: text,
          fontSize: 26,
          fontWeight: '900',
        }}
      >
        {t('ride_decision.title')}
      </Text>
      <Text style={{ color: muted, lineHeight: 20 }}>
        {t('ride_decision.subtitle')}
      </Text>

      {!indicesConfigurados ? (
        <View
          style={{
            gap: 12,
            padding: 16,
            borderRadius: 14,
            backgroundColor: cardBg,
            borderWidth: 1,
            borderColor: border,
          }}
        >
          <Text style={{ color: text, fontWeight: '900' }}>
            {t('ride_decision.sem_indices_titulo')}
          </Text>
          <Text style={{ color: muted }}>
            {t('ride_decision.sem_indices_msg')}
          </Text>
          <TouchableOpacity
            onPress={() => router.push(AppRoutes.calculadoraKorre)}
            style={{
              alignItems: 'center',
              paddingVertical: 12,
              borderRadius: 10,
              backgroundColor: '#00C853',
            }}
          >
            <Text style={{ color: '#06140C', fontWeight: '900' }}>
              {t('ride_decision.abrir_auditoria')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {[
            {
              label: t('ride_decision.valor_oferta'),
              value: valorOferta,
              setter: setValorOferta,
            },
            {
              label: t('ride_decision.tempo_total'),
              value: tempoTotal,
              setter: setTempoTotal,
            },
            {
              label: t('ride_decision.km_embarque'),
              value: kmEmbarque,
              setter: setKmEmbarque,
            },
            {
              label: t('ride_decision.km_viagem'),
              value: kmViagem,
              setter: setKmViagem,
            },
          ].map((field) => (
            <View key={field.label} style={{ gap: 6 }}>
              <Text style={{ color: text, fontWeight: '800' }}>
                {field.label}
              </Text>
              <TextInput
                value={field.value}
                onChangeText={field.setter}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={isDark ? '#4B5563' : '#9CA3AF'}
                style={{
                  minHeight: 48,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: border,
                  color: text,
                  backgroundColor: cardBg,
                }}
              />
            </View>
          ))}

          <TouchableOpacity
            onPress={analisar}
            style={{
              alignItems: 'center',
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: '#00C853',
            }}
          >
            <Text style={{ color: '#06140C', fontWeight: '900' }}>
              {t('ride_decision.analisar')}
            </Text>
          </TouchableOpacity>

          {resultado && (
            <View
              style={{
                gap: 10,
                padding: 16,
                borderRadius: 14,
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: border,
              }}
            >
              <Text
                style={{
                  color: '#00C853',
                  fontSize: 20,
                  fontWeight: '900',
                  textTransform: 'uppercase',
                }}
              >
                {t(`ride_decision.decisoes.${resultado.decisao}`)}
              </Text>
              <Text style={{ color: muted }}>
                {t(resultado.motivo)}
              </Text>
              <Text style={{ color: text }}>
                {t('ride_decision.custo_estimado')}:{' '}
                {formatCurrency(resultado.custoTotal)}
              </Text>
              <Text style={{ color: text }}>
                {t('ride_decision.lucro_liquido')}:{' '}
                {formatCurrency(resultado.lucroLiquido)}
              </Text>
              <Text style={{ color: text }}>
                {t('ride_decision.lucro_hora')}:{' '}
                {formatCurrency(resultado.lucroPorHora)}
              </Text>
              <TouchableOpacity
                disabled={salvando || analiseSalva}
                onPress={salvarAnalise}
                style={{
                  alignItems: 'center',
                  marginTop: 4,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: analiseSalva
                    ? isDark
                      ? '#1F2937'
                      : '#E5E7EB'
                    : '#00C853',
                }}
              >
                <Text
                  style={{
                    color: analiseSalva ? muted : '#06140C',
                    fontWeight: '900',
                  }}
                >
                  {analiseSalva
                    ? t('ride_decision.analise_salva')
                    : salvando
                      ? t('common.salvando')
                      : t('ride_decision.salvar_analise')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {historico.length > 0 && (
            <View
              style={{
                gap: 10,
                padding: 16,
                borderRadius: 14,
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: border,
              }}
            >
              <Text
                style={{
                  color: text,
                  fontSize: 18,
                  fontWeight: '900',
                }}
              >
                {t('ride_decision.historico_titulo')}
              </Text>
              {historico.map((item) => (
                <View
                  key={item.id}
                  style={{
                    paddingTop: 10,
                    borderTopWidth: 1,
                    borderTopColor: border,
                  }}
                >
                  <Text style={{ color: text, fontWeight: '800' }}>
                    {t(`ride_decision.decisoes.${item.decisao}`)} -{' '}
                    {formatCurrency(item.lucro_estimado)}
                  </Text>
                  <Text style={{ color: muted }}>
                    {formatCurrency(item.valor_oferecido)} |{' '}
                    {item.tempo_total_minutos} min |{' '}
                    {item.distancia_embarque_km +
                      item.distancia_corrida_km}{' '}
                    km
                  </Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}
