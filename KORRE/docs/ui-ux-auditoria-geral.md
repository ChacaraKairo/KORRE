# Auditoria Geral de UI/UX

Branch de trabalho: `uiux/pente-fino-geral`

Observacao de git: o repositório estava em `main` com muitas alteracoes nao commitadas antes da auditoria. A branch foi criada a partir desse estado para preservar o trabalho existente. O `git pull origin main` nao foi executado para evitar sobrescrever ou misturar alteracoes locais sem revisao.

## Diretrizes Aplicadas

- Nao alterar regras de negocio principais.
- Nao remover telas, banco, backup ou arquitetura.
- Priorizar consistencia visual, estados vazios, acessibilidade, toque minimo e microcopy.
- Usar os tokens existentes em `styles/tokens.ts` como base do design system.
- Padronizar gradualmente com componentes reutilizaveis em `components/ui`.

## Componentes Base Criados

| Componente | Caminho | Uso previsto | Status |
|---|---|---|---|
| AppScreen | `components/ui/AppScreen.tsx` | Container com SafeArea, fundo por tema e scroll opcional | Criado |
| AppHeader | `components/ui/AppHeader.tsx` | Header consistente com voltar, titulo, subtitulo e acao direita | Criado |
| AppCard | `components/ui/AppCard.tsx` | Card base com borda, raio e fundo por tema | Criado |
| AppButton | `components/ui/AppButton.tsx` | Botao primario/secundario/danger/ghost com loading e icone | Criado |
| EmptyState | `components/ui/EmptyState.tsx` | Estado vazio com icone, titulo, descricao e CTA | Criado |
| LoadingState | `components/ui/LoadingState.tsx` | Loading com texto explicativo | Criado |
| ErrorState | `components/ui/ErrorState.tsx` | Estado de erro com CTA opcional | Criado |
| SectionTitle | `components/ui/SectionTitle.tsx` | Titulo/subtitulo de secao consistente | Criado |
| StatusBadge | `components/ui/StatusBadge.tsx` | Badge sem depender apenas de cor | Criado |

## Correcoes Implementadas Nesta Rodada

- Tela de notificacoes refatorada para usar `AppScreen`, `AppHeader`, `AppButton` e `EmptyState`.
- Estado vazio de notificacoes ganhou descricao util.
- Cards de notificacao ganharam melhor hierarquia, status textual `Nova`/`Lida` e `accessibilityLabel`.
- Acao de limpar notificacoes agora so aparece quando ha itens e possui label acessivel.
- Cadastro financeiro recebeu seletor de data com fluxo `Data / Hoje / Alterar data` e grava `data_transacao` escolhida.
- Novas microcopies foram sincronizadas em `pt`, `en`, `es` e `fr`.

## Inventario de Telas

| Tela | Caminho do arquivo | Status atual | Problemas encontrados | Correcoes feitas | Pendencias |
|---|---|---|---|---|---|
| Entrada/roteamento inicial | `app/index.tsx` | Inventariada | Fluxo depende de estado de auth/loading; precisa teste real em primeira abertura | Nenhuma nesta rodada | Validar splash, login automatico e erro de banco em dispositivo |
| Layout raiz | `app/_layout.tsx` | Inventariada | Arquivo central sensivel; havia alteracoes locais previas | Nenhuma nesta rodada | Revisar protecao de rotas e overlay global em app real |
| Modal global | `app/modal.tsx` | Inventariada | Precisa confirmar consistencia de header/modal | Nenhuma nesta rodada | Validar em telas pequenas |
| Notificacoes | `app/notificacoes.tsx` | Revisada e corrigida | Estado vazio fraco, botao de teste dominante, imports/estilos frageis, acao destrutiva sem label textual | Refatorada com componentes base, empty state, cards melhores e acessibilidade | Confirmar se botao de teste deve ficar em builds de producao |
| Login | `app/(auth)/login.tsx` | Inventariada | Tela ja alterada no worktree; precisa comparacao visual | Nenhuma nesta rodada | Validar teclado, biometria, erro e recuperacao |
| Cadastro | `app/(auth)/cadastro.tsx` | Inventariada | Formulario longo requer teste de teclado/scroll | Nenhuma nesta rodada | Revisar labels, validacao, foto e restauracao de backup |
| Recuperar senha | `app/(auth)/recuperar-senha.tsx` | Inventariada | Precisa microcopy de erro/sucesso especifica | Nenhuma nesta rodada | Validar estados de loading e senha invalida |
| Termos | `app/(auth)/termos.tsx` | Inventariada | Texto longo precisa teste de leitura e botoes fixos | Nenhuma nesta rodada | Validar scroll, contraste e voltar |
| Politica de privacidade | `app/(auth)/politica-privacidade.tsx` | Inventariada | Texto longo e links precisam teste | Nenhuma nesta rodada | Validar acessibilidade e legibilidade |
| Layout autenticado | `app/(tabs)/_layout.tsx` | Inventariada | Tabs precisam revisao de labels, foco e areas de toque | Nenhuma nesta rodada | Validar rotas privadas e botao Android |
| Dashboard | `app/(tabs)/dashboard.tsx` | Inventariada | Muitos cards e estados dependentes de dados | Nenhuma nesta rodada | Revisar sem veiculo, sem transacoes, loading e cards em 320px |
| Garagem | `app/(tabs)/garagem.tsx` | Inventariada | Lista/cards e modal de veiculo precisam padronizacao gradual | Nenhuma nesta rodada | Revisar estado vazio, editar, ativar veiculo e update de km |
| Oficina | `app/(tabs)/oficina.tsx` | Inventariada | Badges e alertas de manutencao precisam consistencia visual | Nenhuma nesta rodada | Aplicar `StatusBadge` em vencida/proxima/planejada |
| Financeiro/custos | `app/(tabs)/finance.tsx` | Revisada e corrigida parcialmente | Data de transacao nao era escolhivel; formulario precisava mais contexto temporal | Seletor `Data / Hoje / Alterar data` com DateTimePicker | Revisar categorias, estado sem veiculo, teclado e botao salvar em telas pequenas |
| Historico/lista de custos | `app/(tabs)/historico.tsx` | Inventariada | Filtros e modal de edicao precisam teste de data/valor | Nenhuma nesta rodada | Padronizar empty/error/loading e labels de filtro |
| Origem de ganhos | `app/(tabs)/origemganhos.tsx` | Inventariada | Grid/lista e modal precisam validacao de textos longos | Nenhuma nesta rodada | Revisar estado vazio, busca e cores customizadas |
| Calculadora Flex | `app/(tabs)/calculadora.tsx` | Inventariada | Fluxo de abastecimento/resultado precisa teste manual | Nenhuma nesta rodada | Revisar consentimento, sem login e mensagens de sucesso |
| Auditoria KORRE/indices | `app/(tabs)/calculadora_korre.tsx` | Inventariada | Formulario denso; risco de hierarquia e scroll | Nenhuma nesta rodada | Revisar modo simples/avancado, sugestoes e sem veiculo |
| Analise de corrida | `app/(tabs)/analisar_corrida.tsx` | Inventariada | Resultado e validacoes dependem de indices | Nenhuma nesta rodada | Revisar estado sem indices e microcopy do resultado |
| Relatorios hub | `app/(tabs)/relatorios.tsx` | Inventariada | Ja tem secoes claras; precisa padronizar header/cards futuramente | Nenhuma nesta rodada | Migrar para `AppHeader`/`SectionTitle` e validar texto em 320px |
| Perfil | `app/(tabs)/perfil.tsx` | Inventariada | Cards e acoes precisam revisar toque e contraste | Nenhuma nesta rodada | Revisar exportar dados, meta financeira e editar perfil |
| Configuracoes | `app/(tabs)/configuracoes.tsx` | Inventariada | Muitas secoes; precisa estados de backup/notificacao claros | Nenhuma nesta rodada | Revisar tema, idioma, privacidade, backup e links externos |
| Suporte | `app/(tabs)/suporte.tsx` | Inventariada | Links externos e copy precisam teste | Nenhuma nesta rodada | Validar abertura de canais e estados de erro |
| Explore/dev dados | `app/(tabs)/explore.tsx` | Inventariada | Tela tecnica; risco de exposicao ao usuario final | Nenhuma nesta rodada | Confirmar se deve ficar acessivel em producao |
| Dev database | `app/(tabs)/dev-database.tsx` | Inventariada | Arquivo novo/untracked; precisa decisao de produto | Nenhuma nesta rodada | Confirmar visibilidade em producao |
| Relatorio DRE | `app/relatorios/balanco_dre.tsx` | Inventariada | Graficos/cards precisam estado sem dados suficiente | Nenhuma nesta rodada | Validar valores R$, periodo e telas pequenas |
| Relatorio Carne-Leao | `app/relatorios/carne-leao.tsx` | Inventariada | Conteudo fiscal precisa microcopy clara e cautelosa | Nenhuma nesta rodada | Validar disclaimer, exportacao e sem dados |
| Relatorio Fluxo de caixa | `app/relatorios/fluxo_caixa.tsx` | Inventariada | Lista/grafico por periodo precisa teste de corte | Nenhuma nesta rodada | Validar filtros, datas BR e empty state |
| Relatorio Manutencoes | `app/relatorios/manutencoes.tsx` | Inventariada | Precisa estado sem manutencao e unidades km/R$ | Nenhuma nesta rodada | Validar cards vencidos/proximos e historico |
| Relatorio Receita por plataforma | `app/relatorios/receita_plataforma.tsx` | Inventariada | Ranking/grafico precisa teste com poucos dados | Nenhuma nesta rodada | Validar empty state e nomes longos |
| Termometro MEI | `app/relatorios/temometro_mei.tsx` | Inventariada | Alertas fiscais precisam contraste e texto direto | Nenhuma nesta rodada | Validar faixas, cores e explicacoes |

## Componentes De Tela Inventariados

| Area | Componentes | Observacoes | Pendencias |
|---|---|---|---|
| Login/cadastro | `components/telas/Login/*`, `components/telas/Cadastro/*` | Fluxos longos e sensiveis a teclado | Unificar inputs/botoes com componentes base sem alterar validacoes |
| Dashboard | `components/telas/Dashboard/*` | Cards importantes para primeira leitura | Revisar estados sem dados e reduzir cores hardcoded |
| Garagem | `components/telas/Garagem/*` | Cards e modal de veiculo | Garantir toque minimo e estado vazio com CTA |
| Oficina | `components/telas/Oficina/*` | Cards de manutencao, modal e reset | Aplicar badges consistentes e textos de erro especificos |
| Financeiro | `components/telas/finance/*` | Valor, categorias, header e sucesso | Revisar acessibilidade dos cards de categoria |
| Historico | `components/telas/historico/*` | Lista, filtros e edicao | Padronizar modais e DateTimePicker |
| Relatorios | `components/telas/Relatorios/*` | Cards fiscais/relatorios | Padronizar empty states e unidades |
| Configuracoes/perfil | `components/telas/Configuracoes/*`, `components/telas/Perfil/*` | Muitas acoes sensiveis | Revisar labels de links, backup e privacidade |

## Pendencias Prioritarias

1. Rodar auditoria visual em dispositivo/emulador para 320, 360, 390 e 430px.
2. Migrar telas principais para `AppScreen`, `AppHeader`, `EmptyState`, `LoadingState` e `ErrorState` aos poucos.
3. Substituir cores hardcoded recorrentes por `tokens`.
4. Revisar todos os modais grandes com teclado aberto.
5. Remover ou proteger telas/botoes de desenvolvimento antes de producao.
6. Validar manualmente backup, restauracao, notificacoes e fluxos fiscais antes de publicar.
