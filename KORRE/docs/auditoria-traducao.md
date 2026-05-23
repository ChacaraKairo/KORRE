# Auditoria de traducao do app

Data: 2026-05-22

## Resultado

O app ainda nao esta 100% coberto por traducao.

As chaves dos arquivos `locales/pt.json`, `locales/en.json`,
`locales/es.json` e `locales/fr.json` estao sincronizadas, e todas as
chamadas `t('...')` encontradas no codigo apontam para chaves existentes.

Mesmo assim, a varredura de textos visiveis encontrou candidatos restantes
escritos diretamente em componentes, telas, alerts e placeholders.

## Corrigido nesta rodada

- Adicionadas chaves que eram usadas via `t(...)`, mas nao existiam nos JSONs.
- Sincronizadas essas chaves nos quatro idiomas.
- Melhorado `scripts/find-hardcoded-user-text.ts` para ignorar falsos positivos
  comuns, como `R$`, `KM`, versoes, exemplos numericos, placas e mascaras.

## Pendencias encontradas

Foram encontrados 291 candidatos restantes de texto hardcoded apos a filtragem
de falsos positivos obvios.

Principais areas afetadas:

- Termos e politica de privacidade.
- Relatorios fiscais, financeiros e de manutencao.
- Cadastro de perfil, veiculo e restauracao de backup.
- Calculadora KORRE e Calculadora Flex.
- Garagem, historico, oficina e perfil.
- Alerts em hooks de calculadora, garagem, historico, oficina, perfil e
  relatorios.

## Como validar

Rodar:

```bash
npm run i18n:check
npm run i18n:scan
```

O objetivo para considerar a traducao completa e fazer `npm run i18n:scan`
retornar:

```text
No hardcoded user-facing text candidates found.
```

