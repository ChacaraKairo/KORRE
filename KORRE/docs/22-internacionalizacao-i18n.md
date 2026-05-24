# 22. Internacionalização (i18n)

## Stack
- `react-i18next`
- Arquivos: `locales/pt.json`, `en.json`, `es.json`, `fr.json`.

## Scripts
- `npm run i18n:check`: valida consistência de chaves.
- `npm run i18n:scan`: detecta texto hardcoded em UI.

## Boas práticas
- Nunca hardcodar texto de usuário em componente.
- Criar chave em `pt` e replicar em `en/es/fr`.
- Usar namespaces/agrupamentos consistentes.

## Implementado atualmente
- Pipeline de validação i18n no projeto.

## Riscos e cuidados
- Diferença de chaves entre idiomas quebra renderização.
