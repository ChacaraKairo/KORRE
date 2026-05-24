# 05. Banco de Dados SQLite

Fonte: `database/DatabaseInit.ts` e `constants/backupSchema.ts`.  
Versão atual: `DATABASE_VERSION = 10`.

## Tabelas principais

### `perfil_usuario`
- Objetivo: cadastro e meta do usuário local.
- Campos-chave: `nome`, `email`, `cpf`, `senha`, metas.
- Sensível: sim (`cpf`, `senha`, `email`).
- Backup: sim (senha excluída na exportação).
- Estatística: não diretamente.

### `veiculos`
- Objetivo: veículos e cache de índices.
- Campos: tipo, marca/modelo/ano, placa, km, custos calculados.
- Sensível: placa (alto risco de identificação).
- Backup: sim.
- Estatística: somente versão anonimizada/agregada.

### `parametros_financeiros`
- Objetivo: parâmetros de cálculo de custo e meta.
- Campos: custos fixos/variáveis, impostos, manutenção, jornada.
- Sensível: baixo.
- Backup: sim.
- Estatística: possível via agregação.

### `categorias_financeiras`
- Objetivo: catálogo de categorias.
- Sensível: não.
- Backup: sim.
- Estatística: sim (agregada).

### `origens_ganho_usuario`
- Objetivo: fontes de ganho configuradas.
- Sensível: baixo.
- Backup: sim.
- Estatística: agregada.

### `transacoes_financeiras`
- Objetivo: ganhos/despesas.
- Sensível: médio (padrão de renda).
- Backup: sim.
- Estatística: apenas agregada/anônima.

### `itens_manutencao`
- Objetivo: plano de manutenção por veículo.
- Campos: intervalo, criticidade, `valor_previsto`, `origem`, `tem_historico_real`, `computar_no_custo`.
- Sensível: baixo.
- Backup: sim.
- Estatística: agregada.

### `historico_manutencao`
- Objetivo: registros reais de manutenção.
- Sensível: baixo/médio.
- Backup: sim.
- Estatística: agregada.

### `notificacoes`
- Objetivo: histórico local de notificações.
- Campos: tipo, prioridade, canal, origem, destino, dedup.
- Sensível: depende de conteúdo.
- Backup: sim.
- Estatística: não recomendado.

### `notificacao_dedup`
- Objetivo: controle de deduplicação.
- Sensível: não.
- Backup: não (controle operacional local).
- Estatística: não.

### `remote_command_logs`
- Objetivo: auditoria de comandos remotos no app.
- Sensível: pode conter metadados operacionais.
- Backup: não em schema principal de backup.
- Estatística: não.

### `analises_corrida`
- Objetivo: histórico de simulações/análises manuais.
- Sensível: médio (perfil de receita/custo).
- Backup: sim.
- Estatística: agregada.

### `abastecimentos`
- Objetivo: registros de combustível/energia.
- Campos: tipo, litros, valor, km, origem, consentimento.
- Sensível: médio.
- Backup: sim.
- Estatística: sim, com consentimento.

### `consumo_veiculo_periodo`
- Objetivo: consumo real calculado por período.
- Campos: km/l, custo combustível/km, confiança.
- Sensível: baixo/médio.
- Backup: sim.
- Estatística: sim, agregada.

### `eventos_veiculo`
- Objetivo: eventos genéricos (abastecimento/manutenção etc.).
- Sensível: médio.
- Backup: sim.
- Estatística: sim, agregada.

### `configuracoes_app`
- Objetivo: chaves de configuração local (ex.: sync, consentimentos).
- Sensível: médio (segredos locais e preferências).
- Backup: não pelo schema principal atual.
- Estatística: não.

## Relacionamentos centrais
- `veiculos` 1:N com `transacoes_financeiras`, `itens_manutencao`, `historico_manutencao`, `analises_corrida`, `abastecimentos`, `consumo_veiculo_periodo`, `eventos_veiculo`.
- `parametros_financeiros` 1:1 por `veiculo_id`.
