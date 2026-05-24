# 06. Migrações do Banco

## Versão atual
- `DATABASE_VERSION = 10`

## Histórico
| Versão | Mudança | Tabelas afetadas | Risco | Teste recomendado |
|---|---|---|---|---|
| V1 | criação inicial do schema principal | várias | alto | instalação limpa e CRUD básico |
| V2 | correção coluna typo histórico | `historico_manutencao` | médio | backup/restore + leitura histórica |
| V3 | dedup de notificações e log remoto | `notificacao_dedup`, `remote_command_logs`, `notificacoes` | médio | notificações e comando remoto |
| V4 | campos por km em parâmetros | `parametros_financeiros` | baixo | cálculo de índices |
| V5 | índices de performance | múltiplas | baixo | consultas chave |
| V6 | criação/índice de análise corrida | `analises_corrida` | baixo | registrar/listar análises |
| V7 | manutenção planejada (origem/histórico real) | `itens_manutencao` | médio | oficina + auditoria |
| V8 | prioridade/canal/grupo notificação | `notificacoes` | baixo | histórico e filtros |
| V9 | abastecimentos/consumo/eventos | 3 tabelas novas | médio/alto | cálculo consumo + backup |
| V10 | fila local de sync | `sync_batches_local` | médio | enfileirar/enviar lotes |

## Cuidados para V11+
- Sempre `addColumnIfMissing` para compatibilidade.
- Evitar migrações destrutivas.
- Atualizar backup schema em paralelo quando necessário.

## Como testar migração
1. Executar app com banco vazio.
2. Executar app com banco em versões antigas simuladas.
3. Validar `PRAGMA user_version`.
4. Rodar testes de backup/restauração.
