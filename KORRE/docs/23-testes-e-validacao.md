# 23. Testes e Validação

## Comandos principais
- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run i18n:check`
- `npm run validate`

## Escopo de testes atual
- Testes unitários em `tests/**/*.test.ts`.
- Cobertura de backup, sync, anonimização e comandos remotos.

## Validação manual recomendada
- Fluxos de login/cadastro.
- Garagem, oficina, financeiro, auditoria, corrida.
- Backup e restore.
- Calculadora flex com e sem login.

## Testes em aparelho físico
- Notificações.
- Permissões e biometria.
- Performance em uso real.

## Riscos e cuidados
- Sempre testar migração + restore em conjunto.
