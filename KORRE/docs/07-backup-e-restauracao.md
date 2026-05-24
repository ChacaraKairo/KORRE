# 07. Backup e Restauração

## Implementado atualmente
- Backup local baseado em JSON estruturado.
- `BACKUP_SCHEMA_VERSION = 10`.
- Exportação sem coluna `senha` de `perfil_usuario`.
- Compatibilidade com backups legados.

## Tabelas exportadas
Ver `constants/backupSchema.ts`:
- perfil, veículos, parâmetros, financeiro, oficina, análises, notificações, abastecimentos, consumo, eventos, fila de sync local.

## Restauração
- Valida `app`, versão e tabelas obrigatórias.
- Sanitiza colunas por tabela antes de inserir.
- Aceita versões anteriores com regras de compatibilidade.

## Criptografia
- Há suporte de backup criptografado no fluxo do app.

## Planejado
- Backup online consentido por usuário.
- Restauração remota autenticada.

## Regra de separação
- Backup privado do usuário **não** é analytics comercial.

## Riscos e cuidados
- Nunca incluir senha/hash no payload de backup online.
- Evitar restauração cega sem validação de schema.
