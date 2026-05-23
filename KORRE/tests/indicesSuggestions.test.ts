import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  applySuggestionsToForm,
  IndicesSuggestionsService,
} from '../modules/indicesKorre/suggestions';

describe('IndicesSuggestionsService', () => {
  it('gera sugestoes a partir do perfil de uso e tipo de veiculo', () => {
    const resultado = IndicesSuggestionsService.gerarSugestoes({
      form: {},
      perfilUso: 'uso_intenso',
      tipoVeiculo: 'moto',
    });

    const campos = resultado.sugestoes.map(
      (sugestao) => sugestao.campo,
    );

    assert.equal(resultado.perfilUso, 'uso_intenso');
    assert.ok(campos.includes('km_por_dia'));
    assert.ok(campos.includes('dias_trabalhados_semana'));
    assert.ok(campos.includes('valor_oleo_filtros'));
    assert.ok(campos.includes('durabilidade_pneus_km'));
  });

  it('aplica sugestoes apenas em campos vazios por padrao', () => {
    const resultado = IndicesSuggestionsService.gerarSugestoes({
      form: { km_por_dia: 150 },
      perfilUso: 'uso_intenso',
      tipoVeiculo: 'moto',
    });

    const aplicado = applySuggestionsToForm(
      { km_por_dia: 150 },
      resultado.sugestoes,
    );

    assert.equal(aplicado.form.km_por_dia, 150);
    assert.ok(
      aplicado.ignoradas.some(
        (sugestao) => sugestao.campo === 'km_por_dia',
      ),
    );
    assert.ok(
      aplicado.aplicadas.some(
        (sugestao) => sugestao.campo === 'valor_oleo_filtros',
      ),
    );
  });
});

