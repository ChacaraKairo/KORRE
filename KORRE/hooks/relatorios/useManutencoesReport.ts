import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import db from '../../database/DatabaseInit';

export function useManutencoesReport() {
  const viewShotRef = useRef<any>(null);

  // Estados de Dados
  const [veiculos, setVeiculos] = useState<any[]>([]);
  const [veiculoSelecionadoId, setVeiculoSelecionadoId] =
    useState<number | null>(null);
  const [veiculoSelecionado, setVeiculoSelecionado] =
    useState('Carregando...');

  const periodos = [
    { id: 30, nome: 'Últimos 30 Dias' },
    { id: 90, nome: 'Últimos 3 Meses' },
    { id: 365, nome: 'Este Ano' },
    { id: 9999, nome: 'Todo o Período' },
  ];
  const [periodoSelecionado, setPeriodoSelecionado] =
    useState(periodos[3]);
  const [periodo, setPeriodo] = useState(periodos[3].nome);

  const [dadosAgrupados, setDadosAgrupados] = useState<
    any[]
  >([]);
  const [totalGasto, setTotalGasto] = useState(0);
  const [totalServicos, setTotalServicos] = useState(0);

  // Estados de Modais e UI
  const [modalShare, setModalShare] = useState(false);
  const [modalFiltroVeiculo, setModalFiltroVeiculo] =
    useState(false);
  const [modalFiltroPeriodo, setModalFiltroPeriodo] =
    useState(false);
  const [ocultarValores, setOcultarValores] =
    useState(false);
  const [layoutParaPrint, setLayoutParaPrint] = useState<
    'none' | 'social' | 'mecanico'
  >('none');

  const carregarDados = useCallback(
    async (vId: number | null, diasFiltro: number) => {
      try {
        const frota: any[] = await db.getAllAsync(
          'SELECT * FROM veiculos',
        );
        setVeiculos(frota);

        let idAtual = vId;
        if (!idAtual && frota.length > 0) {
          const ativo = frota.find((v) => v.ativo === 1);
          idAtual = ativo ? ativo.id : frota[0].id;
        }

        if (idAtual) {
          const veiculo = frota.find(
            (v) => v.id === idAtual,
          );
          if (veiculo) {
            setVeiculoSelecionado(
              `${veiculo.modelo} - ${veiculo.placa || 'S/ Placa'}`,
            );
            setVeiculoSelecionadoId(idAtual);
          }

          let filtroPeriodoSql = '';
          const params: Array<number | string> = [idAtual];

          if (diasFiltro === 365) {
            filtroPeriodoSql =
              " AND date(h.data_servico) >= date('now', 'start of year')";
          } else if (diasFiltro < 9999) {
            filtroPeriodoSql =
              " AND date(h.data_servico) >= date('now', 'localtime', ?)";
            params.push(`-${diasFiltro} days`);
          }

          const historico: any[] = await db.getAllAsync(
            `SELECT h.id, h.valor, h.descricao, h.data_servico, i.nome
           FROM historico_manutencao h
           LEFT JOIN itens_manutencao i ON h.item_id = i.id
           WHERE h.veiculo_id = ?${filtroPeriodoSql}
           ORDER BY date(h.data_servico) DESC, h.id DESC`,
            params,
          );

          // Agrupar itens com o mesmo nome para ter Quantidade, Valor Total e Valor Médio
          const mapa = new Map<string, any>();
          let gastoAcumulado = 0;
          let servicosCount = 0;

          historico.forEach((item) => {
            const nomeReal =
              item.nome ||
              item.descricao ||
              'Serviço Diversos';
            const valorReal = item.valor || 0;

            let dataFormatada = '-';
            if (item.data_servico) {
              const d = new Date(item.data_servico);
              if (!isNaN(d.getTime())) {
                dataFormatada =
                  d.toLocaleDateString('pt-BR');
              }
            }

            if (mapa.has(nomeReal)) {
              const existente = mapa.get(nomeReal);
              existente.quantidade += 1;
              existente.valorTotal += valorReal;
              existente.valorMedio =
                existente.valorTotal / existente.quantidade;
              existente.ultimaData = dataFormatada;
            } else {
              mapa.set(nomeReal, {
                id: item.id.toString(),
                nome: nomeReal,
                quantidade: 1,
                valorTotal: valorReal,
                valorMedio: valorReal,
                ultimaData: dataFormatada,
              });
            }

            gastoAcumulado += valorReal;
            servicosCount += 1;
          });

          // Opcional: Aqui poderíamos fatiar o array se o filtro de dias fosse estrito localmente.
          setDadosAgrupados(Array.from(mapa.values()));
          setTotalGasto(gastoAcumulado);
          setTotalServicos(servicosCount);
        }
      } catch (error) {
        console.error(
          'Erro ao carregar relatorio de manutencoes:',
          error,
        );
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      carregarDados(
        veiculoSelecionadoId,
        periodoSelecionado.id,
      );
    }, [
      carregarDados,
      veiculoSelecionadoId,
      periodoSelecionado,
    ]),
  );

  const trocarVeiculo = (id: number) => {
    setModalFiltroVeiculo(false);
    carregarDados(id, periodoSelecionado.id);
  };

  const trocarPeriodo = (p: any) => {
    setPeriodoSelecionado(p);
    setPeriodo(p.nome);
    setModalFiltroPeriodo(false);
    carregarDados(veiculoSelecionadoId, p.id);
  };

  const partilharPrint = async (
    tipo: 'redes_sociais' | 'mecanico',
  ) => {
    try {
      setModalShare(false);
      setLayoutParaPrint(
        tipo === 'redes_sociais' ? 'social' : 'mecanico',
      );

      // Aguarda a renderização do novo layout no ViewShot fora da tela
      setTimeout(async () => {
        try {
          if (viewShotRef.current) {
            const uri = await viewShotRef.current.capture();

            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(uri, {
                dialogTitle: 'Partilhar Relatório',
              });
            } else {
              Alert.alert(
                'Erro',
                'O partilhamento não está disponível no seu dispositivo.',
              );
            }
          }
        } catch (error) {
          console.error('Erro ao capturar imagem:', error);
        } finally {
          setLayoutParaPrint('none');
        }
      }, 800); // Dá um tempo seguro para a engine renderizar os estilos e a logo
    } catch (error) {
      console.error('Erro ao partilhar:', error);
      Alert.alert(
        'Erro',
        'Não foi possível gerar a imagem.',
      );
      setLayoutParaPrint('none');
    }
  };

  return {
    periodo,
    periodos,
    veiculos,
    veiculoSelecionado,
    veiculoSelecionadoId,
    dadosAgrupados,
    totalGasto,
    totalServicos,
    modalShare,
    setModalShare,
    modalFiltroVeiculo,
    setModalFiltroVeiculo,
    modalFiltroPeriodo,
    setModalFiltroPeriodo,
    ocultarValores,
    setOcultarValores,
    viewShotRef,
    partilharPrint,
    trocarVeiculo,
    trocarPeriodo,
    layoutParaPrint,
  };
}
