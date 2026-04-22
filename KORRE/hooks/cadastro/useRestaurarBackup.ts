// MeuCorre/hooks/cadastro/useRestaurarBackup.ts
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert'; // Verifique se o caminho está correto

export function useRestaurarBackup() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  const executarRestauracao = async (data: any) => {
    console.log('[RESTORE] Iniciando processo...');
    setCarregando(true);

    const tabelas_data = data.tabelas ? data.tabelas : data;

    try {
      await db.execAsync('PRAGMA foreign_keys = OFF;');
      await db.execAsync('BEGIN TRANSACTION;');

      const ordem = [
        'perfil_usuario',
        'veiculos',
        'parametros_financeiros',
        'categorias_financeiras',
        'transacoes_financeiras',
        'itens_manutencao',
        'historico_manutencao',
        'notificacoes',
      ];

      for (const tabela of ordem) {
        await db.execAsync(`DELETE FROM ${tabela};`);
        const rows = tabelas_data[tabela];

        if (
          rows &&
          Array.isArray(rows) &&
          rows.length > 0
        ) {
          const colunas = Object.keys(rows[0]);
          const placeholders = colunas
            .map(() => '?')
            .join(', ');
          const colunasStr = colunas.join(', ');

          for (const row of rows) {
            const valores = colunas.map((col) => row[col]);
            await db.runAsync(
              `INSERT OR REPLACE INTO ${tabela} (${colunasStr}) VALUES (${placeholders})`,
              valores,
            );
          }
        }
      }

      await db.execAsync('COMMIT;');
      await db.execAsync('PRAGMA foreign_keys = ON;');

      // CORREÇÃO AQUI: Passando o array de botões conforme sua Interface AlertButton
      setTimeout(() => {
        showCustomAlert(
          'Sucesso!',
          'Dados restaurados. Bem-vindo de volta!',
          [
            {
              text: 'Ir para Dashboard',
              onPress: () =>
                router.replace('/(tabs)/dashboard'),
            },
          ],
        );
      }, 200);
    } catch (error: any) {
      await db.execAsync('ROLLBACK;');
      await db.execAsync('PRAGMA foreign_keys = ON;');
      console.error('[RESTORE][FATAL]', error);

      setTimeout(() => {
        showCustomAlert(
          'Erro na Restauração',
          'O arquivo de backup é inválido ou incompatível.',
        );
      }, 200);
    } finally {
      setCarregando(false);
    }
  };

  const selecionarArquivo = async () => {
    try {
      console.log('[PICKER] Abrindo seletor...');
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true, // OBRIGATÓRIO para garantir acesso ao arquivo
      });

      if (result.canceled || !result.assets) {
        console.log(
          '[PICKER] Seleção cancelada pelo usuário.',
        );
        return;
      }

      const asset = result.assets[0];
      console.log(
        '[PICKER] Arquivo detectado:',
        asset.name,
      );
      console.log('[PICKER] URI do arquivo:', asset.uri);

      // Tenta ler o conteúdo
      console.log('[PICKER] Tentando ler conteúdo...');
      const conteudo = await FileSystem.readAsStringAsync(
        asset.uri,
      );

      if (!conteudo) {
        console.log(
          '[PICKER] ERRO: Conteúdo do arquivo veio vazio.',
        );
        return;
      }
      console.log(
        '[PICKER] Leitura concluída. Tamanho:',
        conteudo.length,
      );

      // Tenta converter para JSON
      console.log('[PICKER] Fazendo Parse do JSON...');
      const dados = JSON.parse(conteudo);
      console.log('[PICKER] Parse realizado com sucesso.');

      // Dispara o Alerta (com um pequeno delay para não conflitar com o fechar do picker)
      setTimeout(() => {
        console.log(
          '[PICKER] Disparando showCustomAlert...',
        );
        showCustomAlert(
          'Restaurar Dados',
          `Deseja importar o backup "${asset.name}"?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Sim, Restaurar',
              onPress: () => {
                console.log('[ALERT] Botão Sim clicado.');
                executarRestauracao(dados);
              },
            },
          ],
        );
      }, 400);
    } catch (e: any) {
      console.error('[PICKER][ERRO CRÍTICO]', e);
      showCustomAlert(
        'Erro de Leitura',
        'Não foi possível processar este arquivo. Verifique se é um JSON válido.',
      );
    }
  };

  return { selecionarArquivo, carregando };
}
