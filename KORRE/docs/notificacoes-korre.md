# Notificacoes KORRE

## Auditoria Atual

### Arquitetura atual
- `notifications/NotificationService.ts` concentra permissao push, dedup simples e persistencia em `notificacoes`.
- `notifications/LocalNotificationScheduler.ts` concentra verificacoes locais (manutencao, backup, lancamentos, indices, DAS).
- `notifications/NotificationHandler.ts` trata foreground, clique e comandos remotos.
- `notifications/RemoteCommandHandler.ts` e `RemoteCommandValidation.ts` validam comandos e evitam SQL-like input.
- `hooks/notificacoes/useNotificacoes.ts` expoe listagem/disparo/marcar lida/limpar historico.
- `app/notificacoes.tsx` renderiza o historico local.

### Persistencia e backup
- Tabela `notificacoes` existe com colunas: `titulo`, `mensagem`, `tipo`, `lida`, `origem`, `destino`, `dados_json`, `dedup_key`, `data_criacao`.
- Tabela `notificacao_dedup` existe para chaves de deduplicacao.
- `constants/backupSchema.ts` ja inclui `notificacoes` no backup (sem segredos).

### Tipos existentes
- `TipoNotificacao` atual: `info`, `alerta`, `sucesso`, `manutencao`, `financeiro`, `backup`, `sistema`, `servidor`.
- Sem prioridade, sem canal e sem grupos de preferencia.

### Gatilhos atuais identificados
- Inicializacao do app (`app/_layout.tsx`): executa `executarVerificacoesLocais()`.
- Atualizacao de KM (`hooks/dashboard/useDashboard.ts`): chama `verificarAlertasManutencao()`.
- Lancamento financeiro (`hooks/finance/useFinance.ts`): chama `verificarMetaDiaria()`.
- Oficina / auditoria / corrida / backup: sem cobertura completa por dominio no sistema atual.

### Dedup atual
- `shouldCreateNotificationForDedup` apenas bloqueia duplicata exata de `dedupKey`.
- Sem helper padronizado por dia/semana/mes/item.

### Navegacao por clique
- Clique tenta usar `data.destino`; fallback `AppRoutes.notificacoes`.
- Sem validacao robusta de rota invalida/autenticacao no proprio handler.

### Segurança e privacidade
- Ponto forte: comando remoto nao executa SQL e tem allowlist.
- Falta classificacao de criticidade para garantir historico de eventos de seguranca/privacidade mesmo com push desativado.

### Lacunas
- Falta segmentacao por checkers de dominio.
- Falta preferencia por grupo de notificacao.
- Falta padronizacao de tipo/prioridade/canal.
- Falta cobertura de varios eventos (auditoria, oficina planejada, corrida, onboarding, privacidade, suporte).
- Textos novos ainda hardcoded em varios pontos.

## Arquitetura Nova Proposta

### Camadas
1. **Tipos centrais** em `NotificationTypes.ts`.
2. **Preferencias** em `NotificationPreferencesService.ts` (persistencia em `configuracoes_app`).
3. **Dedup keys** em `notificationDedupKeys.ts`.
4. **Servico central** `NotificationService.ts`:
   - valida input;
   - sanitiza dados sensiveis;
   - aplica preferencia por grupo;
   - aplica dedup;
   - grava historico;
   - decide push/in-app/historico.
5. **Checkers por dominio** em `notifications/checkers/*`.
6. **Scheduler** apenas orquestrador.
7. **Event API** para triggers pontuais (KM, oficina, financeiro, auditoria, corrida, backup, seguranca).

## Lista Final de Notificacoes (Resumo)

| Domínio | Tipo | Prioridade | Destino | Regra de disparo | Dedup | Preferência | Canal |
|---|---|---|---|---|---|---|---|
| Manutencao proxima | manutencao | alta | oficina | faltando pouco km/tempo | `manutencao_proxima:{itemId}:{kmLimite}` | manutencao | local+historico |
| Manutencao vencida | manutencao | critica | oficina | limite ultrapassado | `manutencao_vencida:{itemId}:{kmLimite}` | manutencao | local+historico |
| Planejada pendente | oficina | media | oficina | origem auditoria sem historico real | `manutencao_planejada_pendente:{itemId}` | manutencao | historico+in_app |
| Divergencia previsto x real | auditoria | alta | calculadora | diferenca > 20% | `manutencao_divergente:{itemId}:{historicoId}` | indices/auditoria | local+historico |
| Oficina sem dados reais | oficina | media | oficina | sem historico real apos periodo | `oficina_sem_dados:{veiculoId}:{anoSemana}` | manutencao | historico |
| KM desatualizado | garagem | media | garagem | muitos dias sem atualizar | `km_desatualizado:{veiculoId}:{data}` | uso_app | historico |
| Veiculo sem indices | indices | alta | calculadora | indices zerados/incompletos | `veiculo_sem_indices:{veiculoId}` | indices | local+historico |
| Veiculo sem manutencao | oficina | media | oficina | sem itens reais/planejados | `veiculo_sem_manutencao:{veiculoId}` | manutencao | historico |
| Indices incompletos | indices | alta | calculadora | completude baixa | `indices_incompletos:{veiculoId}:{data}` | indices | local+historico |
| Indices desatualizados | indices | alta | calculadora | dados reais mudaram | `indices_desatualizados:{veiculoId}:{data}` | indices | local+historico |
| Sugestoes de revisao | auditoria | media | calculadora | divergencia real x manual | `sugestoes_revisao_indices:{veiculoId}:{data}` | indices/auditoria | in_app+historico |
| Meta batida | meta | baixa | dashboard | ganhos >= meta | `meta_batida:{data}` | financeiro | historico |
| Meta incompleta | meta | media | finance | apos horario alvo sem bater meta | `meta_incompleta:{data}` | financeiro | local+historico |
| Sem lancamentos | financeiro | media | finance | dias sem registro | `sem_lancamentos:{data}` | financeiro | historico |
| Backup pendente | backup | alta | configuracoes | sem backup inicial | `backup_pendente:sem_backup:{data}` | backup | local+historico |
| Backup antigo | backup | alta | configuracoes | backup acima do prazo | `backup_antigo:{data}` | backup | local+historico |
| DAS perto/vencido | mei | alta/critica | finance | janela de vencimento | `das_*:{anoMes}` | mei | local+historico |
| Login/seguranca | seguranca | baixa/alta/critica | login/perfil | eventos de autenticacao | `login_*:{data}` | seguranca | historico (push seletivo) |
| Corrida prejuizo | corrida | alta | analisarCorrida | decisao prejuizo/toxica | `corrida_prejuizo:{timestamp}` | corrida | in_app+historico |
| Onboarding sem veiculo | uso_app | alta | garagem | conta sem veiculo | `onboarding_sem_veiculo:{userId}` | uso_app | historico |
| Politica/termos | privacidade | media | termos/politica | versao alterada | `*_atualizados:{versao}` | privacidade | historico |
| Erro recorrente | sistema | alta | suporte | erro repetido | `erro_recorrente:{codigo}:{data}` | sistema | historico |
| Comando remoto recebido | servidor | media | notificacoes | comando seguro validado | `comando_remoto:{requestId}` | sistema | historico |

## Regras de Privacidade
- Nao incluir CPF/senha/hash/placa completa em titulo/mensagem/dados.
- Nao executar SQL remoto.
- Nao disparar exportacao automatica de backup por remoto.
- Seguranca/privacidade critica sempre no historico local, mesmo com push reduzido.

## Pendencias Futuras (fora deste ciclo)
- Ajuste fino de janelas temporais por perfil de uso.
- Motor de scoring para notificacoes financeiras avancadas.
- Telemetria anonima opt-in de efetividade de notificacoes.
