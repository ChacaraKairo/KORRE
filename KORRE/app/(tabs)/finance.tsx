import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TrendingUp,
  TrendingDown,
  Check,
} from 'lucide-react-native';

// Importação do Hook e Estilos
import { useFinance } from '../../hooks/finance/useFinance';
import { styles as parentStyles } from '../../styles/telas/Finance/AddTransactionStyles';
import { financeStyles as styles } from '../../styles/telas/Finance/financeStyles';

// Importação dos Sub-componentes
import { FinanceHeader } from '../../components/telas/finance/FinanceHeader';
import { ValueInput } from '../../components/telas/finance/ValueInput';
import { CategoryGrid } from '../../components/telas/finance/CategoryGrid';
import { SuccessOverlay } from '../../components/telas/finance/SuccessOverlay';
import { AdicionarCategoria } from '../../components/telas/finance/AdicionarCategoria';
import { useTema } from '../../hooks/modo_tema';

export default function AddTransactionScreen() {
  // Hook Personalizado
  const {
    tipo,
    setTipo,
    valor,
    valorNumerico,
    handleValueChange,
    categoriaSelecionada,
    setCategoriaSelecionada,
    showSuccess,
    allVehicles,
    selectedVehicleId,
    setSelectedVehicleId,
    categorias,
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
        onCancel={() => router.back()}
      />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={parentStyles.content}>
          {/* Seletor de Tipo (Ganho / Despesa) */}
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
              onPress={() => setTipo('ganho')}
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
                GANHO
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
              onPress={() => setTipo('despesa')}
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
                DESPESA
              </Text>
            </TouchableOpacity>
          </View>

          <ValueInput
            valor={valor}
            mainColor={mainColor}
            inputRef={inputRef}
            onChangeText={handleValueChange}
          />

          {/* Seletor de Veículo */}
          <View style={styles.vehicleSection}>
            <Text style={styles.vehicleTitle}>
              Vincular ao Veículo
            </Text>
            <View style={{ height: 50 }}>
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

          <CategoryGrid
            categorias={categorias}
            categoriaSelecionada={categoriaSelecionada}
            onSelect={setCategoriaSelecionada}
            mainColor={mainColor}
          />

          {/* Botão de Adicionar Nova Categoria */}
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
              + ADICIONAR NOVA CATEGORIA
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={parentStyles.footer}>
        <TouchableOpacity
          disabled={
            valorNumerico <= 0 ||
            !categoriaSelecionada ||
            showSuccess
          }
          style={[
            parentStyles.btnSalvar,
            valorNumerico > 0 && categoriaSelecionada
              ? { backgroundColor: mainColor }
              : parentStyles.btnSalvarDisabled,
          ]}
          onPress={handleSave}
        >
          {showSuccess ? (
            <Check size={28} color="#FFF" />
          ) : (
            <TrendingUp
              size={24}
              color={tipo === 'ganho' ? '#0A0A0A' : '#FFF'}
            />
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
            {showSuccess ? 'SALVO!' : 'SALVAR ANOTAÇÃO'}
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
    </KeyboardAvoidingView>
  );
}
