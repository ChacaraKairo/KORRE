import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  Database,
  RefreshCw,
  Trash2,
} from 'lucide-react-native';
import { useExplore } from '../../hooks/explore/useExplore';
import { exploreStyles as styles } from '../../styles/telas/Explore/exploreStyles';
import { useTema } from '../../hooks/modo_tema';

export default function DatabaseViewerScreen() {
  const {
    tabelas,
    tabelaSelecionada,
    setTabelaSelecionada,
    dados,
    carregarDadosTabela,
    limparTabela,
  } = useExplore();

  const { tema } = useTema();
  const isDark = tema === 'escuro';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0A0A0A' : '#F5F5F5' },
      ]}
    >
      <View style={styles.header}>
        <Database size={24} color="#00C853" />
        <Text
          style={[
            styles.title,
            { color: isDark ? '#FFFFFF' : '#000000' },
          ]}
        >
          Inspetor de Dados
        </Text>
        <TouchableOpacity
          onPress={() =>
            tabelaSelecionada &&
            carregarDadosTabela(tabelaSelecionada)
          }
        >
          <RefreshCw size={20} color="#00C853" />
        </TouchableOpacity>
      </View>

      {/* Lista Horizontal de Tabelas */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {tabelas.map((tabela) => (
            <TouchableOpacity
              key={tabela}
              style={[
                styles.tabButton,
                !isDark && {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E0E0E0',
                  borderWidth: 1,
                },
                tabelaSelecionada === tabela &&
                  styles.tabButtonActive,
              ]}
              onPress={() => setTabelaSelecionada(tabela)}
            >
              <Text
                style={[
                  styles.tabText,
                  !isDark && { color: '#555' },
                  tabelaSelecionada === tabela &&
                    styles.tabTextActive,
                ]}
              >
                {tabela}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Cabeçalho da Tabela e Ações */}
      <View style={styles.actionsBar}>
        <Text
          style={[
            styles.infoText,
            { color: isDark ? '#FFFFFF' : '#000000' },
          ]}
        >
          {dados.length} registros em {tabelaSelecionada}
        </Text>
        <TouchableOpacity
          onPress={limparTabela}
          style={styles.deleteButton}
        >
          <Trash2 size={16} color="#FF4444" />
          <Text style={styles.deleteText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Dados (JSON Viewer Simples) */}
      <FlatList
        data={dados}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum registro encontrado.
          </Text>
        }
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark
                  ? '#161616'
                  : '#FFFFFF',
                borderColor: isDark ? '#222' : '#E0E0E0',
                borderWidth: 1,
              },
            ]}
          >
            <Text
              style={[
                styles.cardIndex,
                { color: isDark ? '#FFFFFF' : '#000000' },
              ]}
            >
              #{index + 1}
            </Text>
            {Object.keys(item).map((key) => (
              <View key={key} style={styles.row}>
                <Text
                  style={[
                    styles.key,
                    { color: isDark ? '#888' : '#555' },
                  ]}
                >
                  {key}:
                </Text>
                <Text
                  style={[
                    styles.value,
                    {
                      color: isDark ? '#FFFFFF' : '#000000',
                    },
                  ]}
                >
                  {String(item[key])}
                </Text>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}
