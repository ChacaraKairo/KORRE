# Checklist Final UI/UX

Status desta rodada: auditoria estatica iniciada, componentes base criados, notificacoes e cadastro financeiro corrigidos parcialmente. Validacao manual completa ainda pendente.

| Area | Checklist | Status | Observacoes |
|---|---|---|---|
| Branch | Criar `uiux/pente-fino-geral` | Concluido | Criada preservando worktree existente |
| Loading inicial | Splash, banco, erro e primeira abertura | Pendente manual | Inventariado em `app/index.tsx`, `app/_layout.tsx`, `hooks/splash/useSplash.ts` |
| Login | Login, biometria, erro, teclado | Pendente manual | Tela ja tinha alteracoes locais antes desta rodada |
| Cadastro | Formulario, termos, backup, validacoes | Pendente manual | Exige teste em dispositivo |
| Dashboard | Cards, atalhos, sem dados, manutencoes | Pendente manual | Inventariado |
| Garagem | Lista, cadastro, edicao, ativo, km | Pendente manual | Inventariado |
| Oficina | Planejada, vencida, proxima, registrar | Pendente manual | Inventariado; candidato a `StatusBadge` |
| Custos/financeiro | Registro, categorias, formulario | Parcial | Data da transacao implementada |
| Abastecimento/flex | Calculadora, salvar, resultado, consentimento | Pendente manual | Inventariado |
| Auditoria/indices | Formulario, sugestoes, sem veiculo | Pendente manual | Inventariado |
| Analise de corrida | Formulario, resultado, sem indices | Pendente manual | Inventariado |
| Backup | Exportar, restaurar, criptografia, erros | Pendente manual | Inventariado por configuracoes/hooks |
| Notificacoes | Lista, vazio, leitura, limpar | Parcial | Tela refatorada com componentes base |
| Configuracoes | Idioma, tema, backup, privacidade, sobre | Pendente manual | Inventariado |
| Relatorios | Hub, filtros, graficos, empty states | Pendente manual | Inventariado |
| Acessibilidade | Labels, toque minimo, contraste | Parcial | Notificacoes recebeu labels e toque 44px |
| Responsividade | 320/360/390/430/tablet | Pendente manual | Requer screenshots ou emulador |
| i18n | Chaves sincronizadas | A validar | Novas chaves adicionadas em 4 idiomas |
| Tema | Claro/escuro consistente | Parcial | Componentes base aceitam `isDark` |
| Build/testes | typecheck, lint, i18n, test, validate | A validar | Rodar ao final da rodada |

## Validacao Manual Sugerida

- Abrir o app do zero e observar splash/loading.
- Entrar e sair da conta.
- Criar conta nova e navegar por termos/politica.
- Cadastrar veiculo, ativar veiculo e atualizar km.
- Registrar ganho/despesa com data de hoje e data anterior.
- Registrar manutencao planejada e real.
- Abrir notificacoes sem itens, com item novo e item lido.
- Exportar backup e simular erro de exportacao/restauracao.
- Abrir todos os relatorios com e sem dados.
- Testar botao voltar fisico Android em telas e modais.
- Testar tema claro/escuro e troca de idioma.
