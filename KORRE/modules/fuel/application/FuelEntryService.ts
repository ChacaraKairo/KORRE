import { DataConsentService } from '../../privacy/DataConsentService';
import { FuelEntryRepository } from '../data/FuelEntryRepository';
import type { FuelEntryInput } from '../domain/fuelTypes';

/**
 * Executa a função de to positive.
 */
function toPositive(value: number | null | undefined) {
  const num = Number(value ?? 0);
  return Number.isFinite(num) && num > 0 ? num : null;
}

export const FuelEntryService = {
  normalizarEntrada(input: FuelEntryInput) {
    if (!input.tipoCombustivel) {
      throw new Error('tipo_combustivel_obrigatorio');
    }
    const valorTotal = toPositive(input.valorTotal);
    if (!valorTotal) {
      throw new Error('valor_total_obrigatorio');
    }
    const litros = toPositive(input.litros);
    let precoUnitario = toPositive(input.precoUnitario);

    if (litros && !precoUnitario) {
      precoUnitario = Number((valorTotal / litros).toFixed(4));
    } else if (!litros && precoUnitario) {
      const litrosCalc = Number((valorTotal / precoUnitario).toFixed(4));
      return {
        ...input,
        valorTotal,
        litros: litrosCalc,
        precoUnitario,
      };
    }

    if (input.kmAtual !== undefined && input.kmAtual !== null) {
      if (Number(input.kmAtual) < 0) {
        throw new Error('km_invalido');
      }
    }

    return {
      ...input,
      valorTotal,
      litros: litros ?? null,
      precoUnitario: precoUnitario ?? null,
    };
  },

  async salvarAbastecimento(input: FuelEntryInput) {
    const data = this.normalizarEntrada(input);
    const consent = await DataConsentService.canBeEligibleForStats();
    const elegivel = consent;

    const criadoSemLogin = input.criadoSemLogin ?? !input.veiculoId;
    const id = await FuelEntryRepository.criar({
      veiculoId: data.veiculoId ?? null,
      usuarioLocalId: data.usuarioLocalId ?? null,
      dataAbastecimento: data.dataAbastecimento,
      kmAtual: data.kmAtual ?? null,
      tipoCombustivel: data.tipoCombustivel,
      litros: data.litros ?? null,
      valorTotal: data.valorTotal,
      precoUnitario: data.precoUnitario ?? null,
      tanqueCheio: Boolean(data.tanqueCheio),
      cidade: data.cidade ?? null,
      estadoUf: data.estadoUf ?? null,
      origem: data.origem ?? 'calculadora_flex',
      elegivelEstatistica: elegivel,
      observacao: data.observacao ?? null,
      criadoSemLogin,
      vinculadoAposCadastro: Boolean(data.vinculadoAposCadastro),
    });

    await FuelEntryRepository.registrarEventoAbastecimento({
      veiculoId: data.veiculoId ?? null,
      kmAtual: data.kmAtual ?? null,
      valorTotal: data.valorTotal,
      tipoCombustivel: data.tipoCombustivel,
      origem: data.origem ?? 'calculadora_flex',
      elegivelEstatistica: elegivel,
      detalhes: {
        litros: data.litros ?? null,
        precoUnitario: data.precoUnitario ?? null,
        tanqueCheio: Boolean(data.tanqueCheio),
      },
    });

    if (input.registrarNoFinanceiro && data.veiculoId) {
      await this.registrarNoFinanceiro({
        veiculoId: data.veiculoId,
        tipoCombustivel: data.tipoCombustivel,
        valorTotal: data.valorTotal,
      });
    }

    return { id, elegivelEstatistica: elegivel ? 1 : 0, criadoSemLogin: criadoSemLogin ? 1 : 0 };
  },

  async registrarNoFinanceiro(input: {
    veiculoId: number;
    tipoCombustivel: string;
    valorTotal: number;
  }) {
    const db = (await import('../../../database/DatabaseInit')).default;
    let categoriaId: number | null = null;
    const categoria = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM categorias_financeiras WHERE tipo = 'despesa' AND lower(nome) LIKE '%combust%' LIMIT 1`,
    );
    if (categoria?.id) {
      categoriaId = categoria.id;
    } else {
      const insert: any = await db.runAsync(
        `INSERT INTO categorias_financeiras (nome, tipo, icone, cor) VALUES ('Combustivel', 'despesa', 'Fuel', '#EF4444')`,
      );
      categoriaId = Number(insert.lastInsertRowId);
    }

    await db.runAsync(
      `INSERT INTO transacoes_financeiras (veiculo_id, categoria_id, descricao, valor, tipo, data_transacao)
       VALUES (?, ?, ?, ?, 'despesa', datetime('now', 'localtime'))`,
      [
        input.veiculoId,
        categoriaId,
        `Abastecimento - ${input.tipoCombustivel}`,
        input.valorTotal,
      ],
    );
  },

  async contarPendentesSemLogin() {
    return FuelEntryRepository.contarSemLogin();
  },

  async vincularPendentesAoVeiculo(veiculoId: number) {
    await FuelEntryRepository.vincularSemLoginAoVeiculo(veiculoId);
  },

  async apagarPendentesSemLogin() {
    await FuelEntryRepository.apagarSemLogin();
  },
};
