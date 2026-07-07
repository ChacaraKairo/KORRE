# Formulario dos Indices KORRE

## Antes

A Auditoria KORRE abria como um formulario longo, com muitas secoes tecnicas visiveis ao mesmo tempo. A area de sugestoes tinha muito destaque e o botao de preenchimento automatico ficava no topo, criando a sensacao de que o app poderia tomar decisoes pelo usuario.

## Depois

O fluxo foi reorganizado em etapas:

1. **Introducao**: explica, em linguagem simples, para que servem custo por km, custo por minuto e meta minima.
2. **Modo de ajuste**: permite escolher entre modo simples e modo avancado.
3. **Custos basicos**: concentra os dados principais para estimar custo por km e uso mensal.
4. **Custos avancados**: aparece apenas no modo avancado, mantendo o controle manual para usuarios que desejam refinar tudo.
5. **Revisao**: mostra um resumo antes de salvar os indices.

## Modo Simples

O modo simples e recomendado para a maioria dos usuarios. Ele reduz a carga inicial e deixa o usuario revisar o resumo antes de salvar.

## Modo Avancado

O modo avancado continua disponivel para quem quer controlar custos fixos, custos de tempo, patrimonio, impostos e outras variaveis.

## Sugestao Automatica

A sugestao agora e discreta e opcional:

- nao calcula ao abrir a tela;
- nao aplica nada automaticamente;
- so calcula quando o usuario toca em **Ver sugestao**;
- so altera campos quando o usuario toca em **Aplicar sugestao**;
- mostra origem e confianca dos valores sugeridos;
- permite ignorar sem prejuizo.

## Validacoes

Foram adicionadas validacoes de fluxo:

- valores negativos sao bloqueados;
- etapa basica exige km mensal, rendimento e preco de energia/combustivel;
- etapa avancada exige meta/salario desejado, dias trabalhados e horas por dia;
- o resumo aparece antes do salvamento final.

## Arquivos alterados

- `app/(tabs)/calculadora_korre.tsx`
- `modules/indicesKorre/hooks/useIndicesKorreForm.ts`
- `modules/indicesKorre/domain/indicesFormWorkflow.ts`
- `components/indices/IndicesIntroCard.tsx`
- `components/indices/IndicesModeSelector.tsx`
- `components/indices/IndicesStepProgress.tsx`
- `components/indices/IndicesSuggestionCard.tsx`
- `components/indices/IndicesSummaryCard.tsx`
- `locales/pt.json`
- `locales/en.json`
- `locales/es.json`
- `locales/fr.json`
- `tests/indicesFormWorkflow.test.ts`
