import { useState } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import db from '../../database/DatabaseInit';

export function useExportarDados() {
  const [isExportando, setIsExportando] = useState(false);

  const exportarDados = async () => {
    setIsExportando(true);
    try {
      // 1. Buscar todos os dados de TODAS as tabelas do sistema
      const perfil = await db.getAllAsync(
        'SELECT * FROM perfil_usuario',
      );
      const veiculos = await db.getAllAsync(
        'SELECT * FROM veiculos',
      );
      const categorias = await db.getAllAsync(
        'SELECT * FROM categorias_financeiras',
      );
      const transacoes = await db.getAllAsync(
        'SELECT * FROM transacoes_financeiras',
      );
      const itens_manutencao = await db.getAllAsync(
        'SELECT * FROM itens_manutencao',
      );
      const historico_manutencao = await db.getAllAsync(
        'SELECT * FROM historico_manutencao',
      );
      const notificacoes = await db.getAllAsync(
        'SELECT * FROM notificacoes',
      );

      // 2. Montar um "Super Objeto" com todo o banco de dados
      const backupCompleto = {
        data_exportacao: new Date().toISOString(),
        tabelas: {
          perfil_usuario: perfil,
          veiculos: veiculos,
          categorias_financeiras: categorias,
          transacoes_financeiras: transacoes,
          itens_manutencao: itens_manutencao,
          historico_manutencao: historico_manutencao,
          notificacoes: notificacoes,
        },
      };

      // 3. Converter esse super objeto em JSON formatado
      const jsonString = JSON.stringify(
        backupCompleto,
        null,
        2,
      );

      // 4. Definir o caminho temporário para guardar o ficheiro (.json)
      const fileUri =
        FileSystem.documentDirectory +
        'MeuCorre_BackupCompleto.json';

      // 5. Escrever o ficheiro no telemóvel
      await FileSystem.writeAsStringAsync(
        fileUri,
        jsonString,
        {
          encoding: FileSystem.EncodingType.UTF8,
        },
      );

      // 6. Verificar se o telemóvel suporta partilha e abrir a janela nativa
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Exportar Backup Completo',
          UTI: 'public.json',
        });
      } else {
        Alert.alert(
          'Erro',
          'A partilha não está disponível neste dispositivo.',
        );
      }
    } catch (error) {
      console.error(
        'Erro ao exportar Backup Completo (JSON):',
        error,
      );
      Alert.alert(
        'Erro',
        'Não foi possível gerar o ficheiro de backup.',
      );
    } finally {
      setIsExportando(false);
    }
  };

  return { exportarDados, isExportando };
}
