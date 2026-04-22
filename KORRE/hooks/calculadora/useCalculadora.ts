import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import db from '../../database/DatabaseInit';
// IMPORTANTE: Agora usamos a Fonte Única de Verdade (SSOT)
import { FormularioViabilidade } from '../../type/viabilidadeCorrida';
// IMPORTANTE: Trazendo as regras de IPVA
import {
  REGRAS_IPVA_ESTADOS,
  SiglaEstado,
} from '../../type/ipvaEstados';
import { showCustomAlert } from '../alert/useCustomAlert';
import { CalculadoraService } from './service/CalculadoraService';

const ESTADO_INICIAL_VAZIO: Partial<FormularioViabilidade> =
  {
    estado_uf: 'SP',
    tipo_aquisicao: 'proprio_quitado',
    imposto_mei_mensal: 86,
    vida_util_smartphone_meses: 18,
    // Os demais campos serão preenchidos pelo banco ou manual
  };

export function useCalculadora() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [veiculosDisponiveis, setVeiculosDisponiveis] =
    useState<any[]>([]);
  const [veiculoAtivo, setVeiculoAtivo] =
    useState<any>(null);

  // O estado do formulário agora é fortemente tipado pela SSOT
  const [form, setForm] = useState<
    Partial<FormularioViabilidade>
  >(ESTADO_INICIAL_VAZIO);

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
        console.error(
          'Erro ao carregar formulário:',
          error,
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ATUALIZADO: Busca todos os veículos e define o inicial corretamente
  const carregarDadosIniciais = useCallback(async () => {
    try {
      setLoading(true);
      const lista: any[] = await db.getAllAsync(
        'SELECT * FROM veiculos ORDER BY modelo ASC',
      );
      setVeiculosDisponiveis(lista);

      // Se houver veículos e nenhum ativo selecionado ainda, define o padrão
      if (lista.length > 0 && !veiculoAtivo) {
        const ativo =
          lista.find((v) => v.ativo === 1) || lista[0];
        await carregarFormularioVeiculo(ativo);
      }
    } catch (error) {
      console.error(
        'Erro na carga inicial de veículos:',
        error,
      );
    } finally {
      setLoading(false);
    }
  }, [veiculoAtivo, carregarFormularioVeiculo]);

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  // ATUALIZADO: Função robusta para trocar o veículo no Header
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
      await CalculadoraService.processarESalvarCalculos(
        veiculoAtivo.id,
        form,
      );
      showCustomAlert(
        'Atualizado!',
        'Cálculos de viabilidade sincronizados.',
      );
      router.back();
    } catch (error) {
      console.error('[Hook] Erro na orquestração:', error);
      showCustomAlert(
        'Erro',
        'Não foi possível processar a inteligência financeira.',
      );
    }
  };

  const validarStatusSecoes = useCallback(() => {
    const operacaoCompleta =
      !!form.rendimento_energia_unidade &&
      !!form.preco_energia_unidade;
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
    handleChange,
    calcularESalvar,
    mudarVeiculoAtivo,
    validarStatusSecoes,
    calcularIPVAAutomatico,
  };
}
