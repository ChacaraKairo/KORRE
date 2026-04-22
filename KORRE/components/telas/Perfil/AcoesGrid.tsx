import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Bell,
  Download,
  BarChart3,
  HelpCircle, // <-- Ícone importado para o botão de Suporte
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { styles } from '../../../styles/telas/Perfil/perfilStyles';
import { useTema } from '../../../hooks/modo_tema';

import { useExportarDados } from '../../../hooks/perfil_user/useExportarDados';

export const AcoesGrid = () => {
  const { tema } = useTema();
  const isDark = tema === 'escuro';
  const router = useRouter();

  const { exportarDados, isExportando } =
    useExportarDados();

  return (
    <View>
      <Text
        style={[
          styles.secaoTitle,
          { color: isDark ? '#FFFFFF' : '#000000' },
        ]}
      >
        Configurações
      </Text>
      <View style={styles.gridAcoes}>
        {/* 1. BOTÃO RELATÓRIOS */}
        <TouchableOpacity
          style={[
            styles.btnAcao,
            {
              backgroundColor: isDark
                ? '#161616'
                : '#FFFFFF',
              borderColor: isDark ? '#222' : '#E0E0E0',
              borderWidth: 1,
            },
          ]}
          onPress={() => router.push('/relatorios')}
        >
          <BarChart3 size={24} color="#00C853" />
          <Text
            style={[
              styles.btnAcaoTexto,
              { color: isDark ? '#FFFFFF' : '#000000' },
            ]}
          >
            Relatórios
          </Text>
        </TouchableOpacity>

        {/* 2. BOTÃO NOTIFICAÇÕES */}
        <TouchableOpacity
          style={[
            styles.btnAcao,
            {
              backgroundColor: isDark
                ? '#161616'
                : '#FFFFFF',
              borderColor: isDark ? '#222' : '#E0E0E0',
              borderWidth: 1,
            },
          ]}
          onPress={() => router.push('/notificacoes')}
        >
          <Bell size={24} color="#00C853" />
          <Text
            style={[
              styles.btnAcaoTexto,
              { color: isDark ? '#FFFFFF' : '#000000' },
            ]}
          >
            Notificações
          </Text>
        </TouchableOpacity>

        {/* 3. BOTÃO EXPORTAR DADOS */}
        <TouchableOpacity
          style={[
            styles.btnAcao,
            {
              backgroundColor: isDark
                ? '#161616'
                : '#FFFFFF',
              borderColor: isDark ? '#222' : '#E0E0E0',
              borderWidth: 1,
              opacity: isExportando ? 0.7 : 1,
            },
          ]}
          onPress={exportarDados}
          disabled={isExportando}
        >
          {isExportando ? (
            <ActivityIndicator size={24} color="#00C853" />
          ) : (
            <Download size={24} color="#00C853" />
          )}
          <Text
            style={[
              styles.btnAcaoTexto,
              { color: isDark ? '#FFFFFF' : '#000000' },
            ]}
          >
            {isExportando ? 'A GERAR...' : 'Exportar dados'}
          </Text>
        </TouchableOpacity>

        {/* 4. BOTÃO AJUDA E SUPORTE */}
        <TouchableOpacity
          style={[
            styles.btnAcao,
            {
              backgroundColor: isDark
                ? '#161616'
                : '#FFFFFF',
              borderColor: isDark ? '#222' : '#E0E0E0',
              borderWidth: 1,
            },
          ]}
          // ↓ ALTERE ESTA LINHA ↓
          onPress={() => router.push('/suporte')}
        >
          <HelpCircle size={24} color="#00C853" />
          <Text
            style={[
              styles.btnAcaoTexto,
              { color: isDark ? '#FFFFFF' : '#000000' },
            ]}
          >
            Ajuda e Suporte
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
