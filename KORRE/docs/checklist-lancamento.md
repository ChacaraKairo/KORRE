# Checklist de lançamento — KORRE

## Obrigatório antes do beta

- [x] Rodar `npm run validate`
- [ ] Testar cadastro novo
- [ ] Testar login com senha correta e incorreta
- [ ] Testar bloqueio por tentativas
- [ ] Testar biometria
- [ ] Testar cadastro de veículo
- [ ] Testar origens de ganho
- [ ] Testar registro de ganho
- [ ] Testar registro de despesa
- [ ] Testar backup
- [ ] Testar backup criptografado e guardar senha fora do aparelho
- [ ] Testar restauração
- [ ] Testar restauração de backup JSON legado
- [ ] Testar restauração com senha incorreta
- [ ] Testar notificações
- [ ] Testar suporte sem contatos configurados
- [ ] Testar suporte com contatos configurados
- [ ] Validar política de privacidade
- [ ] Validar termos de uso
- [ ] Gerar build preview
- [ ] Instalar em aparelho físico
- [ ] Testar modo offline
- [ ] Testar salvamento de abastecimento sem login
- [ ] Testar salvamento de abastecimento logado
- [ ] Testar registro no financeiro pelo abastecimento
- [ ] Testar consentimento de estatisticas anonimas
- [ ] Testar desativacao de consentimento
- [ ] Testar backup/restauracao V9
- [ ] Testar sync com API_BASE_URL vazio
- [ ] Testar REQUEST_DATA_SYNC
- [ ] Testar payload sem dados sensiveis
- [ ] Testar tela Privacidade e Dados

## Validado por comando em 2026-05-24

- [x] `npm run validate`
- [x] `npm run i18n:scan`
- [x] Testes unitarios da Analise Manual de Corrida
- [x] Testes de schema de backup com `analises_corrida`
- [x] Testes de schema de backup com campos V7 de `itens_manutencao`
- [x] Arquitetura de notificacoes por dominio com preferencia, dedup e historico local
- [x] Validacao de entrada da Analise Manual de Corrida por typecheck/lint
- [x] Acesso visual para Analise Manual de Corrida no Dashboard e na Auditoria KORRE
- [ ] Testar Analise Manual de Corrida em aparelho fisico
- [ ] Testar historico de analises em aparelho fisico
- [ ] Testar manutencao planejada gerada pela Auditoria KORRE em aparelho fisico
- [ ] Testar backup/restauracao V7 em aparelho fisico
- [ ] Implementar historico/qualidade dos indices KORRE
- [ ] Implementar custo real com dados financeiros
