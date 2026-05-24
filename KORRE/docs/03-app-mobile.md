# 03. App Mobile

## Stack
- Expo SDK 54
- React Native 0.81
- TypeScript strict
- Expo Router
- SQLite (`expo-sqlite`)
- i18n com `react-i18next`

## Inicialização
- `app/_layout.tsx` configura providers, tema e fluxos iniciais.
- `database/DatabaseInit.ts` aplica migrações por `PRAGMA user_version`.

## Estado e domínio
- Hooks por área (`hooks/finance`, `hooks/oficina`, `hooks/viabilidade` etc.).
- Módulos com responsabilidades separadas (`modules/*`).

## Offline-first
- App funciona com banco local sem internet.
- Processos de sync são oportunistas (quando rede existir).

## Implementado atualmente
- Fluxos principais mobile e dados locais completos.

## Planejado
- Consolidação de sincronização segura com servidor.

## Pendente
- Estratégia final de retry/telemetria em produção.

## Riscos e cuidados
- Evitar acoplamento de UI a regras de banco.
