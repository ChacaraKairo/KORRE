# Backup Online no KORRE

## Finalidade
Backup online completo e privado para restauração do próprio usuário.

## Regras
- Requer consentimento `online_backup`.
- Não é usado para analytics de mercado.
- Não envia senha/hash.
- Pode ser desativado pelo usuário a qualquer momento.
- Pode ser apagado remotamente pelo usuário.

## Fluxo
1. Usuário ativa backup online.
2. App monta payload local.
3. App remove campos sensíveis proibidos.
4. App criptografa payload.
5. App envia para endpoint de backup.
6. App permite restaurar ou apagar backup remoto.
