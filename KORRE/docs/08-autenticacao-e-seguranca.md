# 08. Autenticação e Segurança

## Implementado atualmente
- Cadastro/login local no app.
- Armazenamento de senha em formato derivado (hash local).
- Rotas privadas no grupo `(tabs)`.
- Biometria disponível.

## Segurança aplicada
- Banco local com `foreign_keys` e `WAL`.
- Sanitização de backup.
- Guardas de consentimento para sync.
- Bloqueio de comandos remotos perigosos na validação.

## Dados sensíveis
- CPF, e-mail, senha, placa e identificadores pessoais.
- Devem ficar fora de payload analítico.

## Planejado
- Device auth com `serverDeviceCode` + segredo.
- Tokens administrativos no servidor.

## Pendente
- Política formal de retenção de dados.
- Auditoria central de acesso remoto.

## Riscos e cuidados
- Não exibir payloads sensíveis em logs.
- Não executar SQL remoto.
