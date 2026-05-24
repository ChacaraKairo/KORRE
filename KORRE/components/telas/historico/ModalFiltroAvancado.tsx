import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X, Check, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { styles } from '../../../styles/generated/components/telas/historico/ModalFiltroAvancadoStyles';
import { dynamicInlineStyles } from '../../../styles/generated-dynamic/components/telas/historico/ModalFiltroAvancadoDynamicStyles';
/**
 * Executa a função de modal filtro avancado.
 */
export function ModalFiltroAvancado({
  visible,
  onClose,
  filtrosAtuais,
  categoriasDisponiveis,
  onAplicar,
  isDark,
}: any) {
  // Estados locais
  const [tipo, setTipo] = useState(filtrosAtuais.tipo);
  const [periodo, setPeriodo] = useState(
    filtrosAtuais.periodo,
  );
  const [dataInicio, setDataInicio] = useState(
    filtrosAtuais.dataInicioCustom || new Date(),
  );
  const [dataFim, setDataFim] = useState(
    filtrosAtuais.dataFimCustom || new Date(),
  );
  const [
    categoriasSelecionadas,
    setCategoriasSelecionadas,
  ] = useState<number[]>(
    filtrosAtuais.categoriasSelecionadas,
  );

  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);

  // 🔥 SOLUÇÃO: Resetar estados locais ao abrir o modal
  useEffect(() => {
    if (visible) {
      setTipo(filtrosAtuais.tipo);
      setPeriodo(filtrosAtuais.periodo);
      setDataInicio(
        filtrosAtuais.dataInicioCustom || new Date(),
      );
      setDataFim(filtrosAtuais.dataFimCustom || new Date());
      setCategoriasSelecionadas(
        filtrosAtuais.categoriasSelecionadas,
      );
    }
  }, [visible, filtrosAtuais]);

  /**
   * Executa a função de toggle categoria.
   */
  const toggleCategoria = (id: number) => {
    setCategoriasSelecionadas((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id],
    );
  };

  /**
   * Executa a função de handle aplicar.
   */
  const handleAplicar = () => {
    onAplicar({
      tipo,
      periodo,
      dataInicioCustom:
        periodo === 'personalizado' ? dataInicio : null,
      dataFimCustom:
        periodo === 'personalizado' ? dataFim : null,
      categoriasSelecionadas,
    });
    onClose();
  };

  const bgColor = isDark ? '#161616' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const borderColor = isDark ? '#333' : '#EEE';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.content,
            { backgroundColor: bgColor, borderColor },
          ]}
        >
          <View style={styles.header}>
            <Text
              style={[styles.title, { color: textColor }]}
            >
              Filtros Avançados
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#888" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 1. FILTRO DE TIPO */}
            <Text style={styles.sectionTitle}>
              Mostrar apenas
            </Text>
            <View style={styles.row}>
              {['todos', 'ganho', 'despesa'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.chip,
                    tipo === t && styles.chipAtivo,
                    { borderColor },
                  ]}
                  onPress={() => setTipo(t)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      tipo === t && styles.chipTextAtivo,
                    ]}
                  >
                    {t === 'todos'
                      ? 'Tudo'
                      : t.charAt(0).toUpperCase() +
                        t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 2. FILTRO DE PERÍODO */}
            <Text style={styles.sectionTitle}>Período</Text>
            <View style={styles.row}>
              {[
                'dia',
                'semana',
                'mes',
                'personalizado',
              ].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.chip,
                    periodo === p && styles.chipAtivo,
                    { borderColor },
                  ]}
                  onPress={() => setPeriodo(p)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      periodo === p && styles.chipTextAtivo,
                    ]}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {periodo === 'personalizado' && (
              <View style={styles.dateContainer}>
                <TouchableOpacity
                  style={[
                    styles.dateInput,
                    { borderColor },
                  ]}
                  onPress={() => setShowInicio(true)}
                >
                  <Calendar size={16} color="#00C853" />
                  <Text
                    style={dynamicInlineStyles.inline1({ textColor })}
                  >
                    {dataInicio.toLocaleDateString('pt-BR')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.dateInput,
                    { borderColor },
                  ]}
                  onPress={() => setShowFim(true)}
                >
                  <Calendar size={16} color="#00C853" />
                  <Text
                    style={dynamicInlineStyles.inline2({ textColor })}
                  >
                    {dataFim.toLocaleDateString('pt-BR')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 3. FILTRO DE CATEGORIAS */}
            <Text style={styles.sectionTitle}>
              Categorias cadastradas
            </Text>
            <View style={styles.categoriasGrid}>
              {categoriasDisponiveis.map((cat: any) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catItem,
                    categoriasSelecionadas.includes(
                      cat.id,
                    ) && {
                      backgroundColor: `${cat.cor}20`,
                      borderColor: cat.cor,
                    },
                    { borderColor },
                  ]}
                  onPress={() => toggleCategoria(cat.id)}
                >
                  <Text
                    style={[
                      styles.catText,
                      {
                        color:
                          categoriasSelecionadas.includes(
                            cat.id,
                          )
                            ? cat.cor
                            : '#888',
                      },
                    ]}
                  >
                    {cat.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.btnAplicar}
            onPress={handleAplicar}
          >
            <Check size={20} color="#0A0A0A" />
            <Text style={styles.btnAplicarText}>
              Aplicar Filtros
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showInicio && (
        <DateTimePicker
          value={dataInicio}
          mode="date"
          onChange={(e, d) => {
            setShowInicio(false);
            if (d) setDataInicio(d);
          }}
        />
      )}
      {showFim && (
        <DateTimePicker
          value={dataFim}
          mode="date"
          onChange={(e, d) => {
            setShowFim(false);
            if (d) setDataFim(d);
          }}
        />
      )}
    </Modal>
  );
}

// ... styles permanecem os mesmos


