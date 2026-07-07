import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Database,
  Plus,
  RefreshCcw,
  Save,
  Trash2,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import db from '../../database/DatabaseInit';
import { useTema } from '../../hooks/modo_tema';
import { AppRoutes } from '../../constants/routes';

type DbTable = {
  name: string;
};

type DbColumn = {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
};

type DbRow = Record<string, unknown> & {
  __rowid: number;
};

const PAGE_SIZE = 100;
const INTERNAL_COLUMNS = new Set(['__rowid']);

const quoteIdentifier = (identifier: string) => {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(identifier)) {
    throw new Error(`Identificador invalido: ${identifier}`);
  }

  return `"${identifier.replace(/"/g, '""')}"`;
};

const toInputValue = (value: unknown) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const toBindValue = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return value;
};

export default function DevDatabaseScreen() {
  const router = useRouter();
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const colors = useMemo(
    () => ({
      background: isDark ? '#0A0A0A' : '#F5F5F5',
      surface: isDark ? '#161616' : '#FFFFFF',
      surfaceAlt: isDark ? '#202020' : '#EFEFEF',
      border: isDark ? '#262626' : '#DDDDDD',
      text: isDark ? '#FFFFFF' : '#111111',
      muted: isDark ? '#9A9A9A' : '#606060',
      danger: '#F44336',
      accent: '#00C853',
    }),
    [isDark],
  );

  const [tables, setTables] = useState<DbTable[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [columns, setColumns] = useState<DbColumn[]>([]);
  const [rows, setRows] = useState<DbRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<DbRow | null>(
    null,
  );
  const [formData, setFormData] = useState<Record<string, string>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const editableColumns = columns.filter(
    (column) => !INTERNAL_COLUMNS.has(column.name),
  );

  useEffect(() => {
    if (!__DEV__) {
      router.replace(AppRoutes.perfil);
      return;
    }

    void loadTables();
  }, [router]);

  useEffect(() => {
    if (!selectedTable) return;
    void loadTableData(selectedTable);
  }, [selectedTable]);

  const loadTables = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await db.getAllAsync<DbTable>(
        `SELECT name
         FROM sqlite_master
         WHERE type = 'table'
           AND name NOT LIKE 'sqlite_%'
         ORDER BY name`,
      );
      setTables(result);

      if (result.length > 0) {
        setSelectedTable((current) => current || result[0].name);
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Falha ao carregar tabelas.',
      );
    } finally {
      setLoading(false);
    }
  };

  const loadTableData = async (tableName: string) => {
    setLoading(true);
    setError('');
    setSelectedRow(null);
    setFormData({});

    try {
      const safeTable = quoteIdentifier(tableName);
      const tableColumns = await db.getAllAsync<DbColumn>(
        `PRAGMA table_info(${safeTable});`,
      );
      const tableRows = await db.getAllAsync<DbRow>(
        `SELECT rowid AS __rowid, * FROM ${safeTable} ORDER BY rowid DESC LIMIT ${PAGE_SIZE};`,
      );

      setColumns(tableColumns);
      setRows(tableRows);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Falha ao carregar dados.',
      );
    } finally {
      setLoading(false);
    }
  };

  const startCreate = () => {
    const nextForm = editableColumns.reduce<Record<string, string>>(
      (acc, column) => {
        acc[column.name] = '';
        return acc;
      },
      {},
    );
    setSelectedRow(null);
    setFormData(nextForm);
  };

  const startEdit = (row: DbRow) => {
    const nextForm = editableColumns.reduce<Record<string, string>>(
      (acc, column) => {
        acc[column.name] = toInputValue(row[column.name]);
        return acc;
      },
      {},
    );
    setSelectedRow(row);
    setFormData(nextForm);
  };

  const saveForm = async () => {
    if (!selectedTable || editableColumns.length === 0) return;

    setSaving(true);
    setError('');

    try {
      const safeTable = quoteIdentifier(selectedTable);
      const columnNames = Object.keys(formData).filter((name) =>
        editableColumns.some((column) => column.name === name),
      );

      if (columnNames.length === 0) {
        throw new Error('Nenhum campo para salvar.');
      }

      if (selectedRow) {
        const assignments = columnNames
          .map((name) => `${quoteIdentifier(name)} = ?`)
          .join(', ');
        const values = columnNames.map((name) =>
          toBindValue(formData[name] ?? ''),
        );

        await db.runAsync(
          `UPDATE ${safeTable} SET ${assignments} WHERE rowid = ?`,
          [...values, selectedRow.__rowid],
        );
      } else {
        const insertColumns = columnNames.filter((name) => {
          const column = editableColumns.find(
            (item) => item.name === name,
          );
          return !(column?.pk && !formData[name]?.trim());
        });
        const placeholders = insertColumns.map(() => '?').join(', ');
        const values = insertColumns.map((name) =>
          toBindValue(formData[name] ?? ''),
        );

        await db.runAsync(
          `INSERT INTO ${safeTable} (${insertColumns
            .map(quoteIdentifier)
            .join(', ')}) VALUES (${placeholders})`,
          values,
        );
      }

      await loadTableData(selectedTable);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Falha ao salvar registro.',
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteRow = (row: DbRow) => {
    Alert.alert(
      'Apagar registro',
      `Apagar rowid ${row.__rowid} de ${selectedTable}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              const safeTable = quoteIdentifier(selectedTable);
              await db.runAsync(
                `DELETE FROM ${safeTable} WHERE rowid = ?`,
                [row.__rowid],
              );
              await loadTableData(selectedTable);
            } catch (deleteError) {
              setError(
                deleteError instanceof Error
                  ? deleteError.message
                  : 'Falha ao apagar registro.',
              );
            }
          },
        },
      ],
    );
  };

  if (!__DEV__) return null;

  return (
    <View
      style={[
        localStyles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View
        style={[
          localStyles.header,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            localStyles.iconButton,
            { backgroundColor: colors.surfaceAlt },
          ]}
          onPress={() => router.replace(AppRoutes.perfil)}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={localStyles.headerText}>
          <Text style={[localStyles.title, { color: colors.text }]}>
            Banco de Dados
          </Text>
          <Text style={[localStyles.subtitle, { color: colors.muted }]}>
            Ferramenta disponivel apenas em desenvolvimento
          </Text>
        </View>
        <TouchableOpacity
          style={[
            localStyles.iconButton,
            { backgroundColor: colors.surfaceAlt },
          ]}
          onPress={() => loadTableData(selectedTable)}
          disabled={!selectedTable || loading}
        >
          <RefreshCcw size={20} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={localStyles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View
            style={[
              localStyles.errorBox,
              { borderColor: colors.danger },
            ]}
          >
            <Text style={[localStyles.errorText, { color: colors.danger }]}>
              {error}
            </Text>
          </View>
        ) : null}

        <View style={localStyles.sectionHeader}>
          <Text style={[localStyles.sectionTitle, { color: colors.text }]}>
            Tabelas
          </Text>
          <Text style={[localStyles.counter, { color: colors.muted }]}>
            {tables.length}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={localStyles.tableChips}
        >
          {tables.map((table) => {
            const active = table.name === selectedTable;
            return (
              <TouchableOpacity
                key={table.name}
                style={[
                  localStyles.tableChip,
                  {
                    backgroundColor: active
                      ? colors.accent
                      : colors.surface,
                    borderColor: active
                      ? colors.accent
                      : colors.border,
                  },
                ]}
                onPress={() => setSelectedTable(table.name)}
              >
                <Database
                  size={14}
                  color={active ? '#001B0B' : colors.muted}
                />
                <Text
                  style={[
                    localStyles.tableChipText,
                    { color: active ? '#001B0B' : colors.text },
                  ]}
                >
                  {table.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={localStyles.sectionHeader}>
          <Text style={[localStyles.sectionTitle, { color: colors.text }]}>
            {selectedTable || 'Nenhuma tabela'}
          </Text>
          <View style={localStyles.headerActions}>
            <Text style={[localStyles.counter, { color: colors.muted }]}>
              {rows.length}/{PAGE_SIZE}
            </Text>
            <TouchableOpacity
              style={[
                localStyles.smallButton,
                { backgroundColor: colors.accent },
              ]}
              onPress={startCreate}
              disabled={!selectedTable}
            >
              <Plus size={16} color="#001B0B" />
              <Text style={localStyles.smallButtonText}>Novo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            style={localStyles.loading}
            color={colors.accent}
          />
        ) : (
          <View style={localStyles.rowsList}>
            {rows.map((row) => (
              <View
                key={row.__rowid}
                style={[
                  localStyles.rowCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <TouchableOpacity
                  style={localStyles.rowBody}
                  onPress={() => startEdit(row)}
                >
                  <Text
                    style={[localStyles.rowTitle, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    rowid {row.__rowid}
                  </Text>
                  <Text
                    style={[localStyles.rowPreview, { color: colors.muted }]}
                    numberOfLines={2}
                  >
                    {editableColumns
                      .slice(0, 4)
                      .map(
                        (column) =>
                          `${column.name}: ${toInputValue(row[column.name])}`,
                      )
                      .join(' | ')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={localStyles.deleteButton}
                  onPress={() => deleteRow(row)}
                >
                  <Trash2 size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {Object.keys(formData).length > 0 ? (
          <View
            style={[
              localStyles.form,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={localStyles.sectionHeader}>
              <Text
                style={[localStyles.sectionTitle, { color: colors.text }]}
              >
                {selectedRow
                  ? `Editar rowid ${selectedRow.__rowid}`
                  : 'Criar registro'}
              </Text>
              <TouchableOpacity
                style={[
                  localStyles.smallButton,
                  { backgroundColor: colors.accent },
                ]}
                onPress={saveForm}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size={16} color="#001B0B" />
                ) : (
                  <Save size={16} color="#001B0B" />
                )}
                <Text style={localStyles.smallButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>

            {editableColumns.map((column) => (
              <View key={column.name} style={localStyles.field}>
                <Text style={[localStyles.label, { color: colors.muted }]}>
                  {column.name}
                  {column.pk ? ' PK' : ''}
                  {column.notnull ? ' NOT NULL' : ''}
                  {column.type ? ` - ${column.type}` : ''}
                </Text>
                <TextInput
                  value={formData[column.name] ?? ''}
                  onChangeText={(value) =>
                    setFormData((current) => ({
                      ...current,
                      [column.name]: value,
                    }))
                  }
                  placeholder={column.dflt_value ?? 'NULL se vazio'}
                  placeholderTextColor={colors.muted}
                  style={[
                    localStyles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  multiline
                />
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  counter: {
    fontSize: 12,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tableChips: {
    gap: 8,
    paddingBottom: 20,
  },
  tableChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tableChipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  smallButton: {
    minHeight: 36,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  smallButtonText: {
    color: '#001B0B',
    fontSize: 12,
    fontWeight: '900',
  },
  loading: {
    marginVertical: 32,
  },
  rowsList: {
    gap: 10,
    marginBottom: 20,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: '900',
  },
  rowPreview: {
    fontSize: 12,
    lineHeight: 18,
  },
  deleteButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  input: {
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
