import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import db from '../../database/DatabaseInit';

export function useFluxoCaixa() {
  const [loading, setLoading] = useState(true);
  const [dataRef, setDataRef] = useState(new Date());
  const [tipoVisao, setTipoVisao] = useState<
    'mensal' | 'semanal'
  >('mensal');
  const [periodo, setPeriodo] = useState('');

  // Dados consolidados do período
  const [resumo, setResumo] = useState({
    entradas: 0,
    saidas: 0,
    saldoFinal: 0,
  });

  // Histórico diário (Mock para desenhar a lista)
  const [registosDiarios, setRegistosDiarios] = useState<
    any[]
  >([]);

  const carregarDados = useCallback(
    async (data: Date, tipo: 'semanal' | 'mensal') => {
      setLoading(true);
      try {
        let dataInicioStr: string;
        let dataFimStr: string;
        let periodoStr = '';

        const ano = data.getFullYear();
        const mes = data.getMonth();

        if (tipo === 'mensal') {
          const dataFim = new Date(ano, mes + 1, 0); // Último dia do mês

          dataInicioStr = `${ano}-${String(mes + 1).padStart(2, '0')}-01 00:00:00`;
          dataFimStr = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dataFim.getDate()).padStart(2, '0')} 23:59:59`;

          const meses = [
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro',
          ];
          periodoStr = `${meses[mes]} ${ano}`;
        } else {
          // Semanal (Domingo a Sábado)
          const diaSemana = data.getDay();
          const dataInicio = new Date(data);
          dataInicio.setDate(data.getDate() - diaSemana);

          const dataFim = new Date(dataInicio);
          dataFim.setDate(dataInicio.getDate() + 6);

          dataInicioStr = `${dataInicio.getFullYear()}-${String(dataInicio.getMonth() + 1).padStart(2, '0')}-${String(dataInicio.getDate()).padStart(2, '0')} 00:00:00`;
          dataFimStr = `${dataFim.getFullYear()}-${String(dataFim.getMonth() + 1).padStart(2, '0')}-${String(dataFim.getDate()).padStart(2, '0')} 23:59:59`;

          const mesesCurto = [
            'Jan',
            'Fev',
            'Mar',
            'Abr',
            'Mai',
            'Jun',
            'Jul',
            'Ago',
            'Set',
            'Out',
            'Nov',
            'Dez',
          ];
          periodoStr = `${String(dataInicio.getDate()).padStart(2, '0')} ${mesesCurto[dataInicio.getMonth()]} - ${String(dataFim.getDate()).padStart(2, '0')} ${mesesCurto[dataFim.getMonth()]} ${dataFim.getFullYear()}`;
        }

        setPeriodo(periodoStr);

        const transacoes: any[] = await db.getAllAsync(
          `SELECT valor, tipo, data_transacao 
         FROM transacoes_financeiras 
         WHERE data_transacao >= ? AND data_transacao <= ?
         ORDER BY data_transacao DESC`,
          [dataInicioStr, dataFimStr],
        );

        let totalEntradas = 0;
        let totalSaidas = 0;
        const agrupadoPorDia = new Map<string, any>();

        transacoes.forEach((t) => {
          const val = t.valor || 0;
          if (t.tipo === 'ganho') totalEntradas += val;
          else if (t.tipo === 'despesa') totalSaidas += val;

          const dataQuebrada =
            t.data_transacao.split(' ')[0] ||
            t.data_transacao.split('T')[0];
          if (!dataQuebrada) return;

          const dataObj = new Date(
            dataQuebrada + 'T12:00:00Z',
          );
          const diaSemanaStr = [
            'Dom',
            'Seg',
            'Ter',
            'Qua',
            'Qui',
            'Sex',
            'Sáb',
          ][dataObj.getDay()];
          const diaMesStr = String(
            dataObj.getDate(),
          ).padStart(2, '0');
          const mesStr = [
            'Jan',
            'Fev',
            'Mar',
            'Abr',
            'Mai',
            'Jun',
            'Jul',
            'Ago',
            'Set',
            'Out',
            'Nov',
            'Dez',
          ][dataObj.getMonth()];
          const dataFormatadaStr = `${diaMesStr} ${mesStr} (${diaSemanaStr})`;

          if (!agrupadoPorDia.has(dataQuebrada)) {
            agrupadoPorDia.set(dataQuebrada, {
              id: dataQuebrada,
              dataFormatada: dataFormatadaStr,
              entradas: 0,
              saidas: 0,
              saldoDia: 0,
            });
          }

          const dia = agrupadoPorDia.get(dataQuebrada);
          if (t.tipo === 'ganho') {
            dia.entradas += val;
            dia.saldoDia += val;
          } else if (t.tipo === 'despesa') {
            dia.saidas += val;
            dia.saldoDia -= val;
          }
        });

        setResumo({
          entradas: totalEntradas,
          saidas: totalSaidas,
          saldoFinal: totalEntradas - totalSaidas,
        });

        const arrayDias = Array.from(
          agrupadoPorDia.values(),
        ).sort((a, b) => (a.id > b.id ? -1 : 1));
        setRegistosDiarios(arrayDias);
      } catch (error) {
        console.error(
          'Erro ao carregar fluxo de caixa:',
          error,
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      carregarDados(dataRef, tipoVisao);
    }, [dataRef, tipoVisao, carregarDados]),
  );

  const alterarPeriodo = (
    direcao: 'anterior' | 'proximo',
  ) => {
    const novaData = new Date(dataRef);
    if (tipoVisao === 'mensal') {
      novaData.setMonth(
        novaData.getMonth() +
          (direcao === 'anterior' ? -1 : 1),
      );
    } else {
      novaData.setDate(
        novaData.getDate() +
          (direcao === 'anterior' ? -7 : 7),
      );
    }
    setDataRef(novaData);
  };

  const toggleVisao = () => {
    setTipoVisao((prev) =>
      prev === 'mensal' ? 'semanal' : 'mensal',
    );
  };

  return {
    loading,
    periodo,
    tipoVisao,
    resumo,
    registosDiarios,
    alterarPeriodo,
    toggleVisao,
  };
}
