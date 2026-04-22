// Arquivo: src/hooks/oficina/useOficinaData.ts
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import db from '../../database/DatabaseInit';
import { MANUTENCOES_PADRAO } from '../../type/typeManutencoes';
import { TipoVeiculo } from '../../type/typeVeiculos';

export function useOficinaData() {
  const [veiculoConsultado, setVeiculoConsultado] =
    useState<any>(null);
  const [itensVisiveis, setItensVisiveis] = useState<any[]>(
    [],
  );
  const [temManutencaoBanco, setTemManutencaoBanco] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((msg: string) => {
    console.log(msg); // Log no terminal do VS Code/Metro
    setLogs((prev) =>
      [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ${msg}`,
      ].slice(-30),
    );
  }, []);

  const carregarItensManutencao = useCallback(
    async (veiculoId: number, veiculoTipo: TipoVeiculo) => {
      addLog(
        `[SISTEMA] 2. Buscando itens para Veículo ID: ${veiculoId}...`,
      );
      try {
        const itensDb = await db.getAllAsync(
          'SELECT * FROM itens_manutencao WHERE veiculo_id = ? ORDER BY criticidade DESC',
          [veiculoId],
        );

        addLog(
          `[SISTEMA] 3. Itens reais no banco: ${itensDb.length}`,
        );
        setTemManutencaoBanco(itensDb.length > 0);

        const defaultItems =
          MANUTENCOES_PADRAO[veiculoTipo] ||
          MANUTENCOES_PADRAO.moto;
        addLog(
          `[SISTEMA] 4. Itens padrão para ${veiculoTipo}: ${defaultItems.length}`,
        );

        const virtualItems = defaultItems
          .filter(
            (def) =>
              !itensDb.some(
                (dbItem: any) => dbItem.nome === def.nome,
              ),
          )
          .map((def) => ({
            id: `virtual_${def.nome}`,
            veiculo_id: veiculoId,
            nome: def.nome,
            icone: def.icone,
            intervalo_km: def.intervalo_km,
            intervalo_meses: def.intervalo_meses,
            criticidade: def.criticidade,
            ultima_troca_km: null,
            ultima_troca_data: null,
            isVirtual: true,
          }));

        addLog(
          `[SISTEMA] 5. Itens virtuais gerados: ${virtualItems.length}`,
        );

        const listaFinal = [...itensDb, ...virtualItems];
        addLog(
          `[SISTEMA] 6. Lista final consolidada com ${listaFinal.length} itens.`,
        );

        setItensVisiveis(listaFinal);
      } catch (error) {
        addLog(
          `[ERRO] Falha nos itens de manutenção: ${error}`,
        );
      }
    },
    [addLog],
  );

  const carregarDados = useCallback(async () => {
    try {
      addLog('[SISTEMA] 1. Procurando veículo ativo...');
      const veiculoAtivo: any = await db.getFirstAsync(
        'SELECT * FROM veiculos WHERE ativo = 1 LIMIT 1',
      );

      if (veiculoAtivo) {
        addLog(
          `[SISTEMA] Veículo ativo encontrado: ${veiculoAtivo.modelo}`,
        );
        setVeiculoConsultado(veiculoAtivo);
        await carregarItensManutencao(
          veiculoAtivo.id,
          veiculoAtivo.tipo as TipoVeiculo,
        );
      } else {
        addLog(
          '[AVISO] Nenhum veículo ativo (ativo=1) encontrado.',
        );
        setVeiculoConsultado(null);
        setItensVisiveis([]);
        setTemManutencaoBanco(false);
      }
    } catch (error) {
      addLog(`[ERRO] Falha no carregamento: ${error}`);
    }
  }, [addLog, carregarItensManutencao]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  }, [carregarDados]);

  // Listener para atualizações de KM vindas de fora (Dashboard)
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'KM_UPDATED',
      (event) => {
        addLog(
          `[EVENTO] KM atualizado detectado: ${event.novoKm}. Recarregando oficina...`,
        );
        carregarDados(); // Dispara o refresh dos cálculos
      },
    );

    return () => subscription.remove();
  }, [carregarDados, addLog]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      carregarDados().then(() => {
        if (isActive) {
          addLog(
            '[SISTEMA] 7. Processo de carga finalizado.',
          );
          setLoading(false);
        }
      });
      return () => {
        isActive = false;
      };
    }, [carregarDados, addLog]),
  );

  return {
    veiculoConsultado,
    setVeiculoConsultado,
    itensVisiveis,
    temManutencaoBanco,
    loading,
    refreshing,
    logs,
    onRefresh,
    carregarDados,
  };
}
