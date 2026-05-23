import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import db from '../../../database/DatabaseInit';
import type { FormularioViabilidade } from '../domain/types';
import {
  REGRAS_IPVA_ESTADOS,
  SiglaEstado,
} from '../../../type/ipvaEstados';
import {
  BreakdownCustoKm,
  CalculadoraMovimento,
} from '../domain/calculadoraMovimento';
import { showCustomAlert } from '../../../hooks/alert/useCustomAlert';
import { CalculadoraService } from '../application/indicesKorreService';
import {
  hideAppLoading,
  showAppLoadingAsync,
} from '../../../hooks/ui/useAppLoading';
import { safeBack } from '../../../utils/navigation/safeBack';

const ESTADO_INICIAL_VAZIO: Partial<FormularioViabilidade> =
  {
    estado_uf: 'SP',
    tipo_aquisicao: 'proprio_quitado',
    imposto_mei_mensal: 86,
    vida_util_smartphone_meses: 18,
    km_estimado_mes: 0,
    depreciacao_por_km: 0,
    manutencao_imprevista_por_km: 0,
    mao_obra_preventiva_por_km: 0,
    limpeza_higienizacao_por_km: 0,
  };

export function useIndicesKorreForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [veiculosDisponiveis, setVeiculosDisponiveis] =
    useState<any[]>([]);
  const [veiculoAtivo, setVeiculoAtivo] =
    useState<any>(null);
  const [form, setForm] = useState<
    Partial<FormularioViabilidade>
  >(ESTADO_INICIAL_VAZIO);
  const [breakdownKm, setBreakdownKm] =
    useState<BreakdownCustoKm | null>(null);
  const [avisosKm, setAvisosKm] = useState<string[]>([]);

  useEffect(() => {
    const resultadoKm = CalculadoraMovimento.calcularCustoKm(
      form as any,
    );
    setBreakdownKm(resultadoKm.breakdown);
    setAvisosKm(resultadoKm.avisos);
  }, [form]);

  const handleChange = useCallback(
    (
      campo: keyof FormularioViabilidade,
      valor: string | number,
    ) => {
      if (
        campo === 'tipo_aquisicao' ||
        campo === 'estado_uf'
      ) {
        setForm((prev) => ({ ...prev, [campo]: valor }));
        return;
      }

      if (typeof valor === 'number') {
        setForm((prev) => ({
          ...prev,
          [campo]: valor as any,
        }));
        return;
      }

      let textoLimpo = String(valor).replace(',', '.');
      textoLimpo = textoLimpo.replace(/[^0-9.]/g, '');

      const partes = textoLimpo.split('.');
      if (partes.length > 2) {
        textoLimpo =
          partes[0] + '.' + partes.slice(1).join('');
      }

      setForm((prev) => ({
        ...prev,
        [campo]: textoLimpo as any,
      }));
    },
    [],
  );

  const carregarFormularioVeiculo = useCallback(
    async (veiculo: any) => {
      setVeiculoAtivo(veiculo);
      setLoading(true);
      try {
        const { salvos, oficina } =
          await CalculadoraService.carregarDadosCompletosVeiculo(
            veiculo.id,
          );

        setForm(() => {
          const novoForm = {
            ...ESTADO_INICIAL_VAZIO,
            ...salvos,
          };
          if (oficina.valorOleo)
            novoForm.valor_oleo_filtros = oficina.valorOleo;
          if (oficina.kmOleo)
            novoForm.intervalo_oleo_filtros_km =
              oficina.kmOleo;
          if (oficina.valorPneu)
            novoForm.valor_jogo_pneus = oficina.valorPneu;
          if (oficina.kmPneu)
            novoForm.durabilidade_pneus_km = oficina.kmPneu;

          return novoForm as Partial<FormularioViabilidade>;
        });
      } catch (error) {
        console.error('Erro ao carregar formulario:', error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const carregarDadosIniciais = useCallback(async () => {
    try {
      setLoading(true);
      const lista: any[] = await db.getAllAsync(
        'SELECT * FROM veiculos ORDER BY modelo ASC',
      );
      setVeiculosDisponiveis(lista);

      if (lista.length > 0 && !veiculoAtivo) {
        const ativo =
          lista.find((v) => v.ativo === 1) || lista[0];
        await carregarFormularioVeiculo(ativo);
      }
    } catch (error) {
      console.error(
        'Erro na carga inicial de veiculos:',
        error,
      );
    } finally {
      setLoading(false);
    }
  }, [veiculoAtivo, carregarFormularioVeiculo]);

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const mudarVeiculoAtivo = useCallback(
    async (veiculo: any) => {
      if (veiculo.id === veiculoAtivo?.id) return;
      await carregarFormularioVeiculo(veiculo);
    },
    [veiculoAtivo, carregarFormularioVeiculo],
  );

  const calcularESalvar = async () => {
    if (!veiculoAtivo) return;
    try {
      await showAppLoadingAsync('Salvando calculadora...');
      const resultado =
        await CalculadoraService.processarESalvarCalculos(
          veiculoAtivo.id,
          form,
        );
      setBreakdownKm(resultado.breakdownKm);
      setAvisosKm(resultado.avisosKm);

      showCustomAlert(
        'Atualizado!',
        'Cálculos de viabilidade sincronizados.',
      );
      safeBack(router);
    } catch (error) {
      console.error('[Hook] Erro na orquestracao:', error);
      showCustomAlert(
        'Erro',
        'Não foi possível processar a inteligência financeira.',
      );
    } finally {
      hideAppLoading();
    }
  };

  const validarStatusSecoes = useCallback(() => {
    const operacaoCompleta =
      !!form.rendimento_energia_unidade &&
      !!form.preco_energia_unidade &&
      !!form.km_por_dia &&
      !!form.dias_trabalhados_semana;
    const burocraciaCompleta =
      !!form.ipva_anual &&
      !!form.licenciamento_detran_anual;
    const humanoCompleto =
      !!form.salario_liquido_mensal_desejado &&
      !!form.dias_trabalhados_semana;

    let preenchidos = 0;
    if (operacaoCompleta) preenchidos++;
    if (burocraciaCompleta) preenchidos++;
    if (humanoCompleto) preenchidos++;

    return {
      percentualGeral: (preenchidos / 3) * 100,
      operacaoCompleta,
      burocraciaCompleta,
      humanoCompleto,
    };
  }, [form]);

  const calcularIPVAAutomatico = useCallback(
    (ufSelecionada?: SiglaEstado) => {
      const estado =
        ufSelecionada ||
        (form.estado_uf as SiglaEstado) ||
        'SP';
      const valorFipe = Number(form.valor_veiculo_fipe);
      const tipoVeiculo = veiculoAtivo?.tipo;
      const anoVeiculo = veiculoAtivo?.ano;

      if (
        ufSelecionada &&
        ufSelecionada !== form.estado_uf
      ) {
        handleChange('estado_uf', ufSelecionada);
      }

      if (!valorFipe || !tipoVeiculo) {
        showCustomAlert(
          'Dados Insuficientes',
          'Informe o valor FIPE do veículo primeiro.',
        );
        return;
      }

      const regra = REGRAS_IPVA_ESTADOS[estado];
      if (!regra) return;

      const anoAtual = new Date().getFullYear();
      const idadeVeiculo =
        anoAtual - Number(anoVeiculo || anoAtual);

      if (idadeVeiculo >= regra.anos_isencao_idade) {
        handleChange('ipva_anual', '0');
        showCustomAlert(
          'Veículo Isento',
          `Em ${estado}, veículos com ${regra.anos_isencao_idade} anos ou mais não pagam IPVA.`,
        );
        return;
      }

      let aliquota = regra.aliquota_carro;
      if (tipoVeiculo === 'moto')
        aliquota = regra.aliquota_moto;
      else if (tipoVeiculo === 'carro_eletrico')
        aliquota = regra.aliquota_eletrico;
      else if (['van', 'caminhao'].includes(tipoVeiculo))
        aliquota = regra.aliquota_van;

      const valorCalculado = (valorFipe * aliquota).toFixed(
        2,
      );
      handleChange('ipva_anual', valorCalculado);

      showCustomAlert(
        'Cálculo Concluído',
        `IPVA para ${estado} calculado: R$ ${valorCalculado.replace('.', ',')}`,
      );
    },
    [
      form.estado_uf,
      form.valor_veiculo_fipe,
      veiculoAtivo,
      handleChange,
    ],
  );

  return {
    loading,
    veiculoAtivo,
    veiculosDisponiveis,
    form,
    breakdownKm,
    avisosKm,
    handleChange,
    calcularESalvar,
    mudarVeiculoAtivo,
    validarStatusSecoes,
    calcularIPVAAutomatico,
  };
}

export const useCalculadora = useIndicesKorreForm;
