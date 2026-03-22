import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { CalculadoraRepository } from '../../database/repositories/CalculadoraRepository';
import { CalculadoraMath } from '../../utils/calculadoraMath';
import db from '../../database/DatabaseInit';
import { showCustomAlert } from '../alert/useCustomAlert';
import * as Location from 'expo-location';
import {
  REGRAS_IPVA_ESTADOS,
  SiglaEstado,
} from '../../type/ipvaEstados';

// Tipo que reflete as opções de aquisição
export type TipoAquisicao =
  | 'proprio_quitado'
  | 'financiado'
  | 'alugado'
  | 'consorcio'
  | 'emprestado';

export function useCalculadora() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Novos estados para gerenciamento de frota
  const [veiculosDisponiveis, setVeiculosDisponiveis] =
    useState<any[]>([]);
  const [veiculoAtivo, setVeiculoAtivo] =
    useState<any>(null);

  // ============================================================================
  // ESTADO UNIFICADO DO FORMULÁRIO (Mapeia a nova estrutura detalhada)
  // ============================================================================
  const estadoInicialVazio = {
    estado_uf: 'SP', // Para futura automação de IPVA
    tipo_aquisicao: 'proprio_quitado' as TipoAquisicao,
    valor_veiculo_fipe: '',
    depreciacao_real_estimada: '',
    custo_oportunidade_selic: '',
    juros_financiamento_mensal: '',
    diaria_aluguel: '',
    caucao_aluguel_mensalizado: '',
    taxa_administracao_consorcio: '',
    custo_reparacao_emprestimo: '',
    ipva_anual: '',
    licenciamento_detran_anual: '',
    imposto_mei_mensal: '',
    imposto_renda_mensal: '',
    taxa_vistoria_gnv_anual: '',
    taxas_alvaras_municipais_anual: '',
    seguro_comercial_anual: '',
    rastreador_telemetria_mensal: '',
    plano_dados_mensal: '',
    rendimento_energia_unidade: '',
    preco_energia_unidade: '',
    valor_oleo_filtros: '',
    intervalo_oleo_filtros_km: '',
    valor_jogo_pneus: '',
    durabilidade_pneus_km: '',
    valor_manutencao_freios: '',
    intervalo_freios_km: '',
    valor_kit_transmissao: '',
    durabilidade_transmissao_km: '',
    fundo_depreciacao_bateria_por_km: '',
    manutencao_imprevista_mensal: '',
    limpeza_higienizacao_mensal: '',
    alimentacao_diaria: '',
    consumo_apoio_diario: '',
    plano_saude_mensal: '',
    fundo_emergencia_percentual: '',
    provisao_ferias_mensal: '',
    provisao_decimo_terceiro_mensal: '',
    salario_liquido_mensal_desejado: '',
    valor_smartphone: '',
    vida_util_smartphone_meses: '',
    custo_powerbanks_cabos_mensal: '',
    custo_suportes_capas_mensal: '',
    custo_bag_mochila_mensal: '',
    custo_vestuario_protecao_mensal: '',
    percentual_dead_miles: '',
    tempo_espera_medio_minutos: '',
    taxas_saque_antecipacao_mensal: '',
    provisao_multas_mensal: '',
    dias_trabalhados_semana: '',
    horas_por_dia: '',
    km_por_dia: '',
  };

  const [form, setForm] = useState<any>(estadoInicialVazio);

  const handleChange = (campo: string, valor: string) => {
    // Trata strings puras (UF e Tipo de Aquisição)
    if (
      campo === 'tipo_aquisicao' ||
      campo === 'estado_uf'
    ) {
      setForm((prev: any) => ({ ...prev, [campo]: valor }));
      return;
    }
    // Trata números (impede letras e caracteres especiais, mas permite casas decimais)
    const valorLimpo = String(valor).replace(
      /[^0-9.,]/g,
      '',
    );
    setForm((prev: any) => ({
      ...prev,
      [campo]: valorLimpo,
    }));
  };

  // =========================================================================
  // AUTOMAÇÃO DE DADOS EXTERNOS (API Banco Central)
  // =========================================================================
  const buscarTaxaSelic = useCallback(async () => {
    try {
      const response = await fetch(
        'https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/1?formato=json',
      );
      const data = await response.json();

      if (data && data.length > 0) {
        console.log(
          '[useCalculadora] Taxa Selic diária recebida da API BCB:',
          data[0].valor,
        );
        const taxaDiaria = parseFloat(data[0].valor);
        // Transformação em Taxa Anualizada (252 dias úteis)
        const taxaAnual =
          (Math.pow(1 + taxaDiaria / 100, 252) - 1) * 100;

        setForm((prev: any) => ({
          ...prev,
          custo_oportunidade_selic: taxaAnual.toFixed(2),
        }));
      }
    } catch (error) {
      console.error(
        'Erro ao buscar a Taxa Selic no BCB:',
        error,
      );
    }
  }, []);

  // =========================================================================
  // AUTOMAÇÃO DE IPVA (Tabela FIPE)
  // =========================================================================
  const calcularIPVAAutomatico = async (
    novoUf?: SiglaEstado,
  ) => {
    try {
      if (!veiculoAtivo) return;

      const fipeStr = form.valor_veiculo_fipe;
      const fipe =
        parseFloat(String(fipeStr).replace(',', '.')) || 0;

      const sigla =
        novoUf || (form.estado_uf as SiglaEstado);
      const regra = REGRAS_IPVA_ESTADOS[sigla];

      if (fipe <= 0) {
        // Só emite erro se o utilizador clicou no botão "Auto (UF)". Se estiver só a trocar de estado livremente, ignora em silêncio.
        if (!novoUf) {
          showCustomAlert(
            'Falta a FIPE',
            'Preenche primeiro o "Valor Atual na FIPE" (na secção 1) para podermos calcular o teu IPVA.',
          );
        }
        return;
      }

      if (!regra) {
        if (!novoUf) {
          showCustomAlert(
            'Estado Não Selecionado',
            'Por favor, seleciona a sigla do estado (UF) ao lado para podermos calcular o teu IPVA.',
          );
        }
        return;
      }

      // 3. Verificar isenção por Idade do Veículo
      const anoVeiculo = veiculoAtivo.ano;
      if (anoVeiculo) {
        const idade = new Date().getFullYear() - anoVeiculo;
        if (idade >= regra.anos_isencao_idade) {
          setForm((prev: any) => ({
            ...prev,
            ipva_anual: '0',
          }));
          showCustomAlert(
            'Boas Notícias!',
            `Veículos com ${regra.anos_isencao_idade} anos ou mais são Isentos de IPVA em ${sigla}!`,
          );
          return;
        }
      }

      // 4. Classificar pelo tipo e verificar isenção de cilindradas (Motos)
      const tipo = veiculoAtivo.tipo;
      let aliquota = 0;
      let tipoNome = 'Carro';

      if (tipo === 'moto') {
        aliquota = regra.aliquota_moto;
        tipoNome = 'Moto';

        if (
          regra.isencao_moto_cc > 0 &&
          veiculoAtivo.motor
        ) {
          const cc = parseInt(
            veiculoAtivo.motor.replace(/\D/g, ''),
          );
          if (cc > 0 && cc <= regra.isencao_moto_cc) {
            setForm((prev: any) => ({
              ...prev,
              ipva_anual: '0',
            }));
            showCustomAlert(
              'Boas Notícias!',
              `Motos até ${regra.isencao_moto_cc} cilindradas não pagam IPVA em ${sigla}!`,
            );
            return;
          }
        }
      } else if (tipo === 'carro') {
        aliquota = regra.aliquota_carro;
        tipoNome = 'Carro';
      } else if (tipo === 'van' || tipo === 'caminhao') {
        aliquota = regra.aliquota_van;
        tipoNome = 'Utilitário de Carga';
      } else if (tipo === 'carro_eletrico') {
        aliquota = regra.aliquota_eletrico;
        tipoNome = 'Veículo Elétrico';
      } else if (tipo === 'bicicleta') {
        setForm((prev: any) => ({
          ...prev,
          ipva_anual: '0',
        }));
        showCustomAlert(
          'Isenção',
          'Bicicletas não pagam IPVA.',
        );
        return;
      }

      // 5. Calcula o valor e atualiza o estado
      const valorIpva = fipe * aliquota;
      setForm((prev: any) => ({
        ...prev,
        ipva_anual: valorIpva.toFixed(2),
      }));

      showCustomAlert(
        'IPVA Calculado 📍',
        `Estado: ${sigla}\nAlíquota base para ${tipoNome}: ${(aliquota * 100).toFixed(1)}%\n\nO teu IPVA estimado foi calculado em R$ ${valorIpva.toFixed(2)} ao ano.`,
      );
    } catch (error) {
      console.error('Erro na automação do IPVA:', error);
      if (!novoUf) {
        showCustomAlert(
          'Erro',
          'Ocorreu um erro ao calcular o IPVA.',
        );
      }
    }
  };

  // Função modularizada para carregar dados de um veículo específico
  const carregarFormularioVeiculo = async (
    veiculo: any,
  ) => {
    console.log(
      `[useCalculadora] Carregando formulário para o veículo ID ${veiculo.id}...`,
    );
    setVeiculoAtivo(veiculo);
    setLoading(true);

    try {
      const salvos: any =
        await CalculadoraRepository.getParametrosSalvos(
          veiculo.id,
        );
      const oficina =
        await CalculadoraRepository.getDadosDaOficina(
          veiculo.id,
        );

      console.log(
        '[useCalculadora] Dados salvos encontrados no banco:',
        salvos ? 'Sim' : 'Não',
      );

      setForm((prev: any) => {
        // Inicia sempre com o estado vazio para limpar resquícios de outros veículos,
        // mas mantém as strings puras que não podem virar numéricas
        let n = {
          ...estadoInicialVazio,
          estado_uf: prev.estado_uf,
          tipo_aquisicao: prev.tipo_aquisicao,
        };

        if (salvos) {
          Object.keys(salvos).forEach((key) => {
            if (
              salvos[key] !== null &&
              salvos[key] !== undefined
            ) {
              n[key as keyof typeof n] = String(
                salvos[key],
              );
            }
          });
        }

        // Sobrescreve com os dados reais da oficina (se ele tiver registrado lá)
        if (oficina.valorOleo)
          n.valor_oleo_filtros = String(oficina.valorOleo);
        if (oficina.kmOleo)
          n.intervalo_oleo_filtros_km = String(
            oficina.kmOleo,
          );
        if (oficina.valorPneu)
          n.valor_jogo_pneus = String(oficina.valorPneu);
        if (oficina.kmPneu)
          n.durabilidade_pneus_km = String(oficina.kmPneu);

        return n;
      });
    } catch (error) {
      console.error(
        'Erro ao carregar dados do veículo:',
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  const carregarDadosIniciais = useCallback(async () => {
    try {
      console.log(
        '[useCalculadora] Iniciando carregamento de dados...',
      );
      setLoading(true);
      // Busca todos os veículos do usuário
      const listaVeiculos: any[] = await db.getAllAsync(
        'SELECT * FROM veiculos',
      );
      setVeiculosDisponiveis(listaVeiculos);

      console.log(
        `[useCalculadora] ${listaVeiculos.length} veículos encontrados na base.`,
      );

      // Define o veículo ativo padrão (o que estiver com ativo = 1 ou o primeiro da lista)
      const veiculoAtivoInicial =
        listaVeiculos.find((v) => v.ativo === 1) ||
        listaVeiculos[0];

      if (veiculoAtivoInicial) {
        await carregarFormularioVeiculo(
          veiculoAtivoInicial,
        );
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(
        'Erro ao inicializar calculadora:',
        error,
      );
      setLoading(false);
    }
  }, []);

  const mudarVeiculoAtivo = async (id: number) => {
    const novoVeiculo = veiculosDisponiveis.find(
      (v) => v.id === id,
    );
    if (novoVeiculo) {
      await carregarFormularioVeiculo(novoVeiculo);
    }
  };

  useEffect(() => {
    carregarDadosIniciais();
    buscarTaxaSelic();
  }, [carregarDadosIniciais, buscarTaxaSelic]);

  // =========================================================================
  // VALIDAÇÃO DE COMPLETUDE PARA A INTERFACE (UI)
  // =========================================================================
  const validarStatusSecoes = useCallback(() => {
    const checkFields = (fields: string[]) => {
      return fields.every((field) => {
        const val = form[field];
        return (
          val !== '' && val !== null && val !== undefined
        );
      });
    };

    const isEletrico =
      veiculoAtivo?.tipo === 'carro_eletrico';
    const isBike = veiculoAtivo?.tipo === 'bicicleta';
    const isAlugado = form.tipo_aquisicao === 'alugado';

    // 1. Capital e Posse
    let capitalFields: string[] = [];
    if (!isAlugado) {
      capitalFields.push(
        'valor_veiculo_fipe',
        'depreciacao_real_estimada',
        'custo_oportunidade_selic',
      );
    }
    if (form.tipo_aquisicao === 'financiado')
      capitalFields.push('juros_financiamento_mensal');
    if (form.tipo_aquisicao === 'alugado')
      capitalFields.push(
        'diaria_aluguel',
        'caucao_aluguel_mensalizado',
      );
    if (form.tipo_aquisicao === 'consorcio')
      capitalFields.push('taxa_administracao_consorcio');

    const capitalCompleto =
      capitalFields.length > 0
        ? checkFields(capitalFields)
        : true;

    // 2. Burocracia e Fixos
    let burocraciaFields = [
      'seguro_comercial_anual',
      'plano_dados_mensal',
      'imposto_mei_mensal',
      'rastreador_telemetria_mensal',
    ];
    if (!isBike && !isAlugado) {
      burocraciaFields.push(
        'ipva_anual',
        'licenciamento_detran_anual',
      );
    }
    const burocraciaCompleta = checkFields(
      burocraciaFields,
    );

    // 3. Variáveis e Operação
    let variaveisFields = [
      'valor_oleo_filtros',
      'intervalo_oleo_filtros_km',
      'valor_jogo_pneus',
      'durabilidade_pneus_km',
      'valor_manutencao_freios',
      'intervalo_freios_km',
      'manutencao_imprevista_mensal',
      'limpeza_higienizacao_mensal',
    ];
    if (!isBike) {
      variaveisFields.push(
        'rendimento_energia_unidade',
        'preco_energia_unidade',
      );
    }
    if (!isEletrico) {
      variaveisFields.push(
        'valor_kit_transmissao',
        'durabilidade_transmissao_km',
      );
    }
    const operacaoCompleta = checkFields(variaveisFields);

    // 4. Fator Humano (Equipamentos e Metas)
    const humanoFields = [
      'alimentacao_diaria',
      'consumo_apoio_diario',
      'plano_saude_mensal',
      'provisao_ferias_mensal',
      'valor_smartphone',
      'vida_util_smartphone_meses',
    ];
    const humanoCompleto = checkFields(humanoFields);

    // 5. Operação e Plataforma
    const plataformaFields = [
      'percentual_dead_miles',
      'tempo_espera_medio_minutos',
      'dias_trabalhados_semana',
      'horas_por_dia',
      'km_por_dia',
      'salario_liquido_mensal_desejado',
    ];
    const plataformaCompleta = checkFields(
      plataformaFields,
    );

    return {
      capitalCompleto,
      burocraciaCompleta,
      operacaoCompleta,
      humanoCompleto,
      plataformaCompleta,
    };
  }, [form, veiculoAtivo]);

  // =========================================================================
  // SALVAR E GERAR ÍNDICES
  // =========================================================================
  const calcularESalvar = async () => {
    if (!veiculoAtivo) return;

    console.log(
      '[useCalculadora] Iniciando cálculo e salvamento dos índices...',
    );

    // 1. Matemática Pura (Cálculos isolados no utilitário)
    const { ikm, imin, metaMinuto } =
      CalculadoraMath.calcularIndices(
        form,
        veiculoAtivo.tipo,
      );
    const completude =
      CalculadoraMath.calcularCompletude(form);

    console.log(
      `[useCalculadora] Resultados matemáticos -> IKM: ${ikm}, IMIN: ${imin}, MetaMinuto: ${metaMinuto}, Completude: ${completude}%`,
    );

    try {
      // 2. Salva o Formulário Completo (40+ Variáveis) no banco
      await CalculadoraRepository.salvarParametros(
        veiculoAtivo.id,
        form,
      );

      // 3. Salva os Índices Mágicos e a Taxa de Completude (Para o Dashboard)
      await CalculadoraRepository.salvarIndices(
        veiculoAtivo.id,
        ikm,
        imin,
        metaMinuto,
        completude,
      );

      let mensagem = `Seu perfil está ${completude.toFixed(0)}% completo.\nÍndices: R$${ikm.toFixed(2)}/km e R$${imin.toFixed(2)}/minuto.`;

      console.log(
        '[useCalculadora] Dados salvos com sucesso no SQLite!',
      );

      showCustomAlert('Auditoria Salva!', mensagem, [
        { text: 'Bora!', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Erro ao salvar os cálculos:', error);
      showCustomAlert(
        'Erro',
        'Ocorreu um erro ao gravar os seus parâmetros no banco.',
      );
    }
  };

  return {
    loading,
    veiculoAtivo,
    veiculosDisponiveis,
    mudarVeiculoAtivo,
    buscarTaxaSelic,
    calcularIPVAAutomatico,
    form,
    handleChange,
    calcularESalvar,
    validarStatusSecoes,
  };
}
