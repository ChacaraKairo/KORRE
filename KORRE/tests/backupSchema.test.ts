import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  BACKUP_APP_NAME,
  BACKUP_SCHEMA_VERSION,
  BACKUP_TABLES,
  sanitizeBackupRow,
  validateBackupPayload,
} from '../constants/backupSchema';

const makeBackup = (
  app = BACKUP_APP_NAME,
  versaoBanco = BACKUP_SCHEMA_VERSION,
) => ({
  app,
  versao_banco: versaoBanco,
  tabelas: Object.fromEntries(
    BACKUP_TABLES.map((table) => [table, []]),
  ),
});

describe('backup schema validation', () => {
  it('aceita backup KORRE v2', () => {
    const tabelas = validateBackupPayload(
      makeBackup(BACKUP_APP_NAME, 2),
    );
    assert.deepEqual(tabelas.perfil_usuario, []);
  });

  it('aceita backup KORRE v3', () => {
    const tabelas = validateBackupPayload(
      makeBackup(BACKUP_APP_NAME, 3),
    );
    assert.deepEqual(tabelas.perfil_usuario, []);
  });

  it('aceita backup KORRE v4', () => {
    const tabelas = validateBackupPayload(makeBackup());
    assert.deepEqual(tabelas.perfil_usuario, []);
  });

  it('aceita backup KORRE v5 com origens de ganho', () => {
    const backup = makeBackup(BACKUP_APP_NAME, 5) as any;
    backup.tabelas.origens_ganho_usuario = [
      {
        id: 1,
        nome: 'Uber',
        categoria: 'Transporte',
        icone: 'Navigation',
        cor: '#000000',
        ativo: 1,
      },
    ];

    const tabelas = validateBackupPayload(backup);
    assert.equal(
      (tabelas.origens_ganho_usuario as unknown[]).length,
      1,
    );
  });

  it('aceita backup KORRE v6 com analises de corrida', () => {
    const backup = makeBackup(BACKUP_APP_NAME, 6) as any;
    backup.tabelas.analises_corrida = [
      {
        id: 1,
        veiculo_id: 2,
        valor_oferecido: 35,
        distancia_embarque_km: 2,
        distancia_corrida_km: 10,
        tempo_total_minutos: 30,
        custo_estimado: 18,
        lucro_estimado: 17,
        lucro_por_hora: 34,
        decisao: 'aceitavel',
        data_analise: '2026-05-24 12:00:00',
      },
    ];

    const tabelas = validateBackupPayload(backup);
    assert.equal((tabelas.analises_corrida as unknown[]).length, 1);
  });

  it('aceita backup v4 sem tabela de origens de ganho', () => {
    const backup = makeBackup(BACKUP_APP_NAME, 4) as any;
    delete backup.tabelas.origens_ganho_usuario;

    const tabelas = validateBackupPayload(backup);
    assert.equal(tabelas.origens_ganho_usuario, undefined);
  });

  it('aceita backup v5 sem tabela de analises de corrida', () => {
    const backup = makeBackup(BACKUP_APP_NAME, 5) as any;
    delete backup.tabelas.analises_corrida;

    const tabelas = validateBackupPayload(backup);
    assert.equal(tabelas.analises_corrida, undefined);
  });

  it('rejeita backup de outro app', () => {
    assert.throws(() => validateBackupPayload(makeBackup('OutroApp')));
  });

  it('nao restaura senha de backups antigos ou manipulados', () => {
    const { columns } = sanitizeBackupRow('perfil_usuario', {
      id: 1,
      nome: 'KORRE',
      senha: 'hash-legado',
    });

    assert.deepEqual(columns, ['id', 'nome']);
  });

  it('sanitiza linhas de origens de ganho no restore', () => {
    const { columns, values } = sanitizeBackupRow(
      'origens_ganho_usuario',
      {
        id: 1,
        nome: 'iFood',
        categoria: 'Delivery',
        icone: 'ShoppingBag',
        cor: '#EA1D2C',
        ativo: 1,
        campo_inesperado: 'ignorado',
      },
    );

    assert.deepEqual(columns, [
      'id',
      'nome',
      'categoria',
      'icone',
      'cor',
      'ativo',
    ]);
    assert.deepEqual(values, [
      1,
      'iFood',
      'Delivery',
      'ShoppingBag',
      '#EA1D2C',
      1,
    ]);
  });
});
