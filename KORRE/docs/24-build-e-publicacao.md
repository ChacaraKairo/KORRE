# 24. Build e Publicação

## Arquivos de configuração
- `app.json`
- `eas.json`

## Scripts e fluxos
- Desenvolvimento: `npm start`
- Android local: `npm run android`
- Build EAS preview: `npx eas build --profile preview --platform android`
- Build EAS production: `npx eas build --profile production --platform android`

## Versionamento
- Versão do app em `package.json` e `app.json`.
- Migrações de banco exigem versionamento cuidadoso.

## Implementado atualmente
- Pipeline de build para Android com EAS.

## Planejado
- Estratégia de release channel/track mais granular.

## Riscos e cuidados
- Validar permissões e termos antes de publicação pública.
