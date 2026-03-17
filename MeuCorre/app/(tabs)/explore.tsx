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

export default function DatabaseViewerScreen() {
  const {
    tabelas,
    tabelaSelecionada,
    setTabelaSelecionada,
    dados,
    carregarDadosTabela,
    limparTabela,
  } = useExplore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Database size={24} color="#00C853" />
        <Text style={styles.title}>Inspetor de Dados</Text>
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
                tabelaSelecionada === tabela &&
                  styles.tabButtonActive,
              ]}
              onPress={() => setTabelaSelecionada(tabela)}
            >
              <Text
                style={[
                  styles.tabText,
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
        <Text style={styles.infoText}>
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
          <View style={styles.card}>
            <Text style={styles.cardIndex}>
              #{index + 1}
            </Text>
            {Object.keys(item).map((key) => (
              <View key={key} style={styles.row}>
                <Text style={styles.key}>{key}:</Text>
                <Text style={styles.value}>
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
