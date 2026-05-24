# 15. Notificações

## Arquitetura atual
- `NotificationService` central.
- Checkers por domínio em `notifications/checkers`.
- Histórico em tabela `notificacoes`.
- Deduplicação com `dedup_key` e `notificacao_dedup`.

## Classificações
- Tipo, prioridade, canal, origem e grupo de preferência.

## Domínios
- Manutenção/oficina
- Financeiro/metas
- Índices/auditoria
- Corrida
- Backup
- Segurança

## Implementado atualmente
- Preferências locais e dedup helpers.
- Roteamento por destino e fallback de rota.

## Planejado
- Push remoto integrado ao servidor.

## Riscos e cuidados
- Evitar spam de notificações.
- Segurança crítica deve manter histórico local.
