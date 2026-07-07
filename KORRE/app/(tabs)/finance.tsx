import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CalendarDays,
  Check,
  TrendingDown,
  TrendingUp,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { inlineStyles } from '../../styles/generated-inline/app/(tabs)/financeInlineStyles';
import { useFinance } from '../../hooks/finance/useFinance';
import { styles as parentStyles } from '../../styles/telas/Finance/AddTransactionStyles';
import { financeStyles as styles } from '../../styles/telas/Finance/financeStyles';

import { FinanceHeader } from '../../components/telas/finance/FinanceHeader';
import { ValueInput } from '../../components/telas/finance/ValueInput';
import { CategoryGrid } from '../../components/telas/finance/CategoryGrid';
import { SuccessOverlay } from '../../components/telas/finance/SuccessOverlay';
import { AdicionarCategoria } from '../../components/telas/finance/AdicionarCategoria';
import { useTema } from '../../hooks/modo_tema';
import { safeBack } from '../../utils/navigation/safeBack';
import { AppRoutes } from '../../constants/routes';

export default function AddTransactionScreen() {
  const { t } = useTranslation();
  const {
    tipo,
    setTipo,
    valor,
    valorNumerico,
    handleValueChange,
    dataTransacao,
    setDataTransacao,
    categoriaSelecionada,
    setCategoriaSelecionada,
    showSuccess,
    salvando,
    allVehicles,
    selectedVehicleId,
    setSelectedVehicleId,
    categorias,
    semOrigemGanho,
    mainColor,
    inputRef,
    handleSave,
    router,
    modalCategoriaAberto,
    setModalCategoriaAberto,
    novaCategoriaNome,
    setNovaCategoriaNome,
    novaCategoriaIcone,
    setNovaCategoriaIcone,
    handleAddCategoria,
  } = useFinance();

  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const [showDatePicker, setShowDatePicker] = useState(false);
  const voltar = useCallback(() => {
    safeBack(router);
  }, [router]);

  const hoje = new Date();
  const isHoje =
    dataTransacao.getFullYear() === hoje.getFullYear() &&
    dataTransacao.getMonth() === hoje.getMonth() &&
    dataTransacao.getDate() === hoje.getDate();

  const dataLabel = isHoje
    ? t('financeiro.hoje')
    : dataTransacao.toLocaleDateString('pt-BR');

  const handleDateChange = (_event: unknown, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (!selectedDate) return;

    const proximaData = new Date(dataTransacao);
    proximaData.setFullYear(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    );
    setDataTransacao(proximaData);
  };

  const podeSalvar =
    valorNumerico > 0 &&
    !!categoriaSelecionada &&
    !showSuccess &&
    !salvando;

  return (
    <KeyboardAvoidingView
      style={[
        parentStyles.container,
        { backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5' },
      ]}
      behavior={
        Platform.OS === 'ios' ? 'padding' : undefined
      }
    >
      <FinanceHeader
        tipo={tipo}
        mainColor={mainColor}
        onCancel={voltar}
      />

      <ScrollView
        style={inlineStyles.inline1}
        showsVerticalScrollIndicator={false}
      >
        <View style={parentStyles.content}>
          <View style={styles.financeTypeRow}>
            <TouchableOpacity
              style={[
                styles.financeTypeBtn,
                {
                  backgroundColor:
                    tipo === 'ganho'
                      ? 'rgba(0, 200, 83, 0.1)'
                      : isDark
                        ? '#1A1A1A'
                        : '#FFFFFF',
                  borderColor:
                    tipo === 'ganho'
                      ? '#00C853'
                      : isDark
                        ? '#333'
                        : '#E0E0E0',
                  borderWidth: 1,
                },
              ]}
              onPress={() => {
                setCategoriaSelecionada('');
                setTipo('ganho');
              }}
              activeOpacity={0.7}
            >
              <TrendingUp
                size={20}
                color={
                  tipo === 'ganho' ? '#00C853' : '#666'
                }
              />
              <Text
                style={[
                  styles.financeTypeBtnText,
                  {
                    color:
                      tipo === 'ganho' ? '#00C853' : '#666',
                  },
                ]}
              >
                {t('financeiro.ganho')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.financeTypeBtn,
                {
                  backgroundColor:
                    tipo === 'despesa'
                      ? 'rgba(244, 67, 54, 0.1)'
                      : isDark
                        ? '#1A1A1A'
                        : '#FFFFFF',
                  borderColor:
                    tipo === 'despesa'
                      ? '#F44336'
                      : isDark
                        ? '#333'
                        : '#E0E0E0',
                  borderWidth: 1,
                },
              ]}
              onPress={() => {
                setCategoriaSelecionada('');
                setTipo('despesa');
              }}
              activeOpacity={0.7}
            >
              <TrendingDown
                size={20}
                color={
                  tipo === 'despesa' ? '#F44336' : '#666'
                }
              />
              <Text
                style={[
                  styles.financeTypeBtnText,
                  {
                    color:
                      tipo === 'despesa'
                        ? '#F44336'
                        : '#666',
                  },
                ]}
              >
                {t('financeiro.despesa')}
              </Text>
            </TouchableOpacity>
          </View>

          <ValueInput
            valor={valor}
            mainColor={mainColor}
            inputRef={inputRef}
            onChangeText={handleValueChange}
          />

          <View style={styles.dateSection}>
            <Text style={styles.dateTitle}>
              {t('financeiro.data')}
            </Text>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setShowDatePicker(true)}
              style={[
                styles.dateButton,
                {
                  backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
                  borderColor: isDark ? '#333' : '#E0E0E0',
                },
              ]}
            >
              <View style={styles.dateValueRow}>
                <CalendarDays size={20} color={mainColor} />
                <Text
                  style={[
                    styles.dateValue,
                    { color: isDark ? '#FFFFFF' : '#1A1A1A' },
                  ]}
                >
                  {dataLabel}
                </Text>
              </View>
              <Text style={[styles.dateChangeText, { color: mainColor }]}>
                {t('financeiro.alterar_data')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.vehicleSection}>
            <Text style={styles.vehicleTitle}>
              {t('financeiro.vincular_veiculo')}
            </Text>
            <View style={inlineStyles.inline2}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={
                  styles.vehicleScrollView
                }
              >
                {allVehicles.map((v) => (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() =>
                      setSelectedVehicleId(v.id)
                    }
                    style={[
                      styles.vehicleBtn,
                      {
                        backgroundColor:
                          selectedVehicleId === v.id
                            ? mainColor
                            : isDark
                              ? '#1A1A1A'
                              : '#FFFFFF',
                        borderColor:
                          selectedVehicleId === v.id
                            ? mainColor
                            : isDark
                              ? '#333'
                              : '#E0E0E0',
                        borderWidth:
                          selectedVehicleId === v.id
                            ? 0
                            : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.vehicleBtnText,
                        {
                          color:
                            selectedVehicleId === v.id
                              ? '#0A0A0A'
                              : isDark
                                ? '#888'
                                : '#555',
                        },
                      ]}
                    >
                      {v.modelo.toUpperCase()}
                      {v.placa ? ` - ${v.placa}` : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {semOrigemGanho ? (
            <View
              style={{
                borderWidth: 1,
                borderColor: isDark ? '#333' : '#E0E0E0',
                backgroundColor: isDark ? '#161616' : '#FFFFFF',
                borderRadius: 8,
                padding: 16,
                gap: 10,
              }}
            >
              <Text
                style={{
                  color: isDark ? '#FFFFFF' : '#1A1A1A',
                  fontSize: 16,
                  fontWeight: '800',
                }}
              >
                {t('financeiro.sem_origem_ganho')}
              </Text>
              <Text
                style={{
                  color: isDark ? '#888' : '#555',
                  fontSize: 13,
                  lineHeight: 18,
                }}
              >
                {t('financeiro.sem_origem_ganho_desc')}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push(AppRoutes.origemGanhos)}
                style={{
                  minHeight: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  backgroundColor: mainColor,
                  paddingHorizontal: 14,
                }}
              >
                <Text
                  style={{
                    color: '#0A0A0A',
                    fontSize: 13,
                    fontWeight: '900',
                    textAlign: 'center',
                  }}
                >
                  {t('financeiro.configurar_origens_ganho')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <CategoryGrid
              categorias={categorias}
              categoriaSelecionada={categoriaSelecionada}
              onSelect={setCategoriaSelecionada}
              mainColor={mainColor}
            />
          )}

          {tipo === 'despesa' && (
            <TouchableOpacity
              style={styles.addCategoryBtn}
              onPress={() => setModalCategoriaAberto(true)}
            >
              <Text
                style={[
                  styles.addCategoryBtnText,
                  { color: mainColor },
                ]}
              >
                {t('financeiro.adicionar_categoria')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={parentStyles.footer}>
        <TouchableOpacity
          disabled={!podeSalvar}
          style={[
            parentStyles.btnSalvar,
            podeSalvar
              ? { backgroundColor: mainColor }
              : parentStyles.btnSalvarDisabled,
          ]}
          onPress={handleSave}
        >
          {salvando && !showSuccess ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : showSuccess ? (
            <Check size={28} color="#FFF" />
          ) : (
            <>
              {tipo === 'ganho' ? (
                <TrendingUp size={24} color="#0A0A0A" />
              ) : (
                <TrendingDown size={24} color="#FFF" />
              )}
            </>
          )}
          <Text
            style={[
              parentStyles.btnSalvarText,
              {
                color:
                  tipo === 'ganho' &&
                  valorNumerico > 0 &&
                  categoriaSelecionada
                    ? '#0A0A0A'
                    : '#FFF',
              },
            ]}
          >
            {salvando
              ? t('financeiro.salvando')
              : showSuccess
                ? t('financeiro.salvo')
                : t('financeiro.salvar_anotacao')}
          </Text>
        </TouchableOpacity>
      </View>

      {showSuccess && (
        <SuccessOverlay mainColor={mainColor} />
      )}

      <AdicionarCategoria
        visible={modalCategoriaAberto}
        onClose={() => setModalCategoriaAberto(false)}
        onSave={handleAddCategoria}
        nome={novaCategoriaNome}
        setNome={setNovaCategoriaNome}
        icone={novaCategoriaIcone}
        setIcone={setNovaCategoriaIcone}
        mainColor={mainColor}
      />

      {showDatePicker && (
        <DateTimePicker
          value={dataTransacao}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </KeyboardAvoidingView>
  );
}
