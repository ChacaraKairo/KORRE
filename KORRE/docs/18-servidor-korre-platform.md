# 18. Servidor KORRE Platform

## Escopo planejado
- API NestJS.
- PostgreSQL + Prisma.
- Auth admin.
- Handshake de dispositivo.
- Backup online e restore.
- Comandos remotos seguros.
- Notificações push e logs.

## Estado atual
- Projeto de servidor em evolução fora do app mobile.
- Contratos iniciais documentados em `docs/app-server-sync-contract.md`.

## Segurança esperada
- JWT em rotas admin.
- Device auth em rotas mobile.
- Rejeição de comandos perigosos.
- Auditoria de ações.

## Riscos e cuidados
- Nunca misturar backup privado com analytics comercial.
