# KORRE
link na play store 'https://play.google.com/store/apps/details?id=korre_app.gestao.korucompany&pcampaignid=web_share'

Aplicativo mobile offline-first para motoristas e entregadores controlarem ganhos, despesas, veiculo, manutencao e viabilidade de corridas.

O codigo do app fica em [`KORRE`](./KORRE).

## Status

MVP avancado / beta tecnico. O projeto ja possui banco local SQLite, cadastro, login, backup/restauracao, notificacoes, calculos financeiros, telas principais, testes e CI. Antes de venda publica, ainda precisa de validacao com usuarios reais, revisao de seguranca, suporte oficial e checklist de publicacao.

## Stack

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript strict
- Expo Router
- SQLite local via `expo-sqlite`
- Testes com `node:test` e `tsx`

## Primeiros passos

```bash
cd KORRE
npm ci
cp .env.example .env
npm start
```

## Validacao local

```bash
cd KORRE
npm run validate
```

Esse comando roda testes, typecheck e lint.

## Builds

```bash
cd KORRE
npx eas build --profile preview --platform android
npx eas build --profile production --platform android
```

O perfil `preview` gera build interno para testes controlados. O perfil `production` gera Android App Bundle para a Play Store.

## Documentacao principal

Veja o README tecnico em [`KORRE/README.md`](./KORRE/README.md).
