# Auditoria de lançamento — KORRE

## 1. Resumo executivo

O KORRE está em bom estágio de MVP/beta técnico: a estrutura Expo Router está organizada, o app é offline-first com SQLite local, há testes unitários para partes críticas e existem serviços separados para backup, notificações e repositórios.

Ainda não está pronto para produção pública sem ajustes finais. Os maiores pontos de atenção eram suporte com canais falsamente renderizados, categorias de ganho genéricas no registro financeiro, muitos textos hardcoded, logs de debug em fluxos não críticos e necessidade de documentação operacional para lançamento. Nesta rodada foram tratados os pontos de suporte, configuração central de contatos e regra de negócio de origens de ganho.

## 2. Pontos críticos

- A tela de suporte usava variáveis `EXPO_PUBLIC_KORRE_SUPPORT_*` e renderizava canais mesmo vazios. Corrigido com `config/companyContacts.ts` e renderização condicional.
- O registro financeiro criava/carregava várias categorias padrão de ganho, contrariando a regra de que ganho deve ser origem selecionada pelo usuário. Corrigido com persistência de origens selecionadas.
- A tabela de seleção de origens de ganho não existia, então não havia forma segura de desmarcar uma origem sem apagar categoria usada em transações antigas. Corrigido com `origens_ganho_usuario`.
- Backups passaram a ter versão de schema 5 para incluir as origens selecionadas sem quebrar backups v2-v4.
- Há textos hardcoded em telas secundárias e relatórios; isso não bloqueia beta, mas reduz qualidade de i18n.

## 3. Segurança

Senhas são armazenadas por hash com salt e iterações em `utils/auth/passwordHash.ts`, com comparação em tempo constante. O login possui bloqueio temporário após tentativas excessivas, e mensagens de falha não revelam se e-mail/CPF existe.

Biometria redireciona ao dashboard após autenticação local. Como a tela só oferece biometria quando há usuário local, o risco é moderado, mas a auditoria recomenda amarrar esse fluxo a uma política explícita de sessão local.

Backups não exportam senha, pois `BACKUP_EXPORT_COLUMNS` remove `perfil_usuario.senha`. A restauração valida o payload antes de abrir transação e não restaura senha. O fluxo de backup criptografado foi iniciado em etapa anterior com `decryptJson`; recomenda-se criar testes dedicados antes de expor exportação criptografada ao usuário final.

Comandos remotos ficam desligados por padrão via `EXPO_PUBLIC_KORRE_ENABLE_REMOTE_COMMANDS=false`. Os comandos atuais não apagam dados nem exportam backup automaticamente, mas retornam resumos financeiros se forem ativados. Para produção, só ativar com backend autenticado.

## 4. Banco de dados e integridade

O banco usa SQLite, `PRAGMA user_version`, WAL e `foreign_keys`. A restauração usa transação e religa foreign keys no `finally`.

Foi adicionada a tabela `origens_ganho_usuario` para diferenciar origens selecionadas das categorias financeiras usadas por transações históricas. A decisão evita apagar categorias antigas e preserva `categoria_id` em `transacoes_financeiras`.

O schema de backup foi elevado para versão 5 e backups antigos v2-v4 continuam aceitos sem exigir a tabela nova. Pontos a melhorar: há inserts padrão em mais de um lugar e algumas mensagens/logs ainda usam strings fixas.

## 5. Configurações e ambiente

`.env.example` agora mantém apenas variáveis técnicas:

- `EXPO_PUBLIC_KORRE_API_BASE_URL`
- `EXPO_PUBLIC_KORRE_ENABLE_REMOTE_COMMANDS=false`

Contatos públicos da empresa foram movidos para `config/companyContacts.ts`, que é o ponto único para WhatsApp, e-mail, site, YouTube, Instagram, política e termos. Campos permanecem vazios até existirem dados oficiais.

## 6. Suporte e dados oficiais da empresa

A tela `app/(tabs)/suporte.tsx` foi refatorada para consumir `COMPANY_CONTACTS`. Ela não exibe WhatsApp, YouTube, e-mail ou site quando vazios, e mostra mensagem profissional de canais em configuração.

Foi removida a promessa visual de resposta em 24h da renderização. A FAQ agora usa textos genéricos e verdadeiros, sem prometer suporte, prazo ou acesso remoto aos dados.

## 7. UX e regras de negócio

O fluxo de registro financeiro agora respeita a regra de negócio: despesas continuam usando categorias de despesa, enquanto ganhos usam somente origens selecionadas/cadastradas em Origens de Ganho. Se não houver origem ativa, há estado vazio com botão para configurar.

Ainda há telas com rotas hardcoded e textos fixos, especialmente Perfil, Oficina, Histórico e Relatórios. A recomendação é limpar por prioridade, sem refatoração ampla.

## 8. Internacionalização

Existem `pt`, `en`, `es` e `fr`. As novas strings de suporte, financeiro, startup e backup foram adicionadas aos quatro idiomas. Ainda há textos fixos fora dos JSONs, principalmente em modais e relatórios. O francês existe e deve ser mantido apenas se houver compromisso de revisar cobertura; caso contrário, documentar como idioma beta.

## 9. Build e publicação

`app.json` define nome, slug, versão, ícones, splash, package Android e permissões. As permissões Android são relativamente contidas, com localização e áudio bloqueados. EAS possui profiles `development`, `preview` e `production`.

Antes de Play Store, validar nome público, package definitivo, política de privacidade, termos, screenshots, descrição, classificação indicativa e canais reais de suporte.

## 10. Plano de correção por prioridade

| Prioridade | Problema | Impacto | Arquivo(s) | Correção proposta |
|---|---|---|---|---|
| P0 | Suporte renderizava canais não configurados | Usuário via canal inexistente como oficial | `app/(tabs)/suporte.tsx`, `.env.example` | Corrigido com `config/companyContacts.ts` e renderização condicional |
| P0 | Ganhos usavam categorias genéricas | Transações de receita podiam ser classificadas fora da origem real | `hooks/finance/useFinance.ts`, `hooks/OrigemGanhos/useOrigemGanhos.ts` | Corrigido com `origens_ganho_usuario` e repository |
| P0 | Seleção/desmarcação de origem não era persistida | Origem desmarcada continuaria aparecendo | `database/repositories/OrigemGanhosRepository.ts` | Corrigido com tabela de seleção ativa |
| P1 | Backups precisavam incluir seleção de origens | Restauração perderia regra de ganho selecionado | `constants/backupSchema.ts` | Corrigido com schema v5 e compatibilidade v2-v4 |
| P1 | Muitos textos fixos fora do i18n | Troca de idioma fica incompleta | `app/`, `components/`, `hooks/` | Migrar telas restantes por prioridade |
| P1 | Logs com `console.error` em fluxos críticos | Ruído e risco de exposição em produção | `hooks/`, `notifications/` | Trocar por `logger` e evitar dados sensíveis |
| P1 | Comandos remotos retornam resumo financeiro se ativados | Risco de privacidade sem backend autenticado | `notifications/` | Manter flag false e exigir autenticação servidor |
| P2 | Rotas hardcoded ainda existem | Risco em renomeação de rotas | `app/`, `components/` | Usar `AppRoutes` progressivamente |
| P2 | FAQ e termos precisam revisão jurídica | Risco de comunicação imprecisa | `app/(auth)`, `PRIVACY_POLICY.md` | Revisão jurídica antes de produção |
| P3 | Francês pode estar incompleto | Experiência inconsistente | `locales/fr.json` | Completar ou marcar como idioma beta |

## 11. Validação executada

Foi executado `npm run validate`, que rodou testes, typecheck e lint com sucesso. A validação automatizada não substitui os testes manuais em dispositivo físico listados em `docs/checklist-lancamento.md`.
