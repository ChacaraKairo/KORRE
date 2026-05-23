# Roadmap de Features - Indices KORRE, Custos, Oficina e Analise de Corridas

Este documento organiza a evolucao dos indices KORRE em features independentes.
O objetivo e separar responsabilidades para que cada parte do app possa evoluir
sem misturar planejamento, gasto real e decisao de corrida.

## Regra conceitual

```txt
Auditoria planeja.
Oficina acompanha.
Financeiro registra a realidade.
Indices calculam o custo.
Analise de corrida decide se vale a pena.
```

## Fase 1 - Melhorar a base dos indices

1. Auditoria KORRE / formulario de indices
   - Modo simples e modo avancado.
   - Botao "Preencher para mim".
   - Perfis de uso editaveis.
   - Resumo antes de salvar.
   - Qualidade da estimativa.

2. Sugestoes automaticas de custos
   - Sugestoes por historico, pre-cadastro, tipo de veiculo e padrao conservador.
   - Origem e confianca visiveis para o usuario.
   - Valores ja preenchidos pelo usuario nao devem ser sobrescritos sem confirmacao.

3. Pre-cadastro de custos de manutencao
   - Custo previsto nao e despesa real.
   - Item planejado na oficina nao cria historico nem lancamento financeiro.
   - Manutencao realizada continua criando historico e despesa.

4. Sincronizacao Auditoria x Oficina
   - Auditoria cria ou atualiza itens planejados.
   - Dados reais de oficina sao preservados.
   - Valores estimados nao apagam ultima troca ou historico real.

## Fase 2 - Tornar o custo mais real

5. Custo real com dados financeiros
   - Usar despesas reais dos ultimos 30, 90 e 180 dias para sugerir custos.
   - Diferenciar valor manual, sugerido e real.

6. Historico e qualidade dos indices
   - Registrar cada recalculo.
   - Mostrar nivel de confianca: baixa, media ou alta.
   - Informar quando indices estao desatualizados.

10. Aprendizado com dados reais
   - Comparar previsto x realizado.
   - Sugerir revisao quando houver divergencia relevante.
   - Nunca alterar indices automaticamente sem confirmacao.

## Fase 3 - Analisar corridas manualmente

7. Analise manual de corrida
   - Usuario informa valor, tempo, km ate embarque e km da viagem.
   - App usa indices do veiculo ativo.
   - Resultado mostra decisao, custo estimado, lucro liquido e lucro por hora.

8. Motor de decisao de corridas
   - Servico puro, reutilizavel e testavel.
   - Sem dependencia de React ou tela.

9. Historico de analises de corridas
   - Salvar analises quando o usuario quiser.
   - Preparar relatorios futuros por plataforma, decisao e resultado.

## Fase 4 - Futuro

11. Monitor de tela de corridas
   - Fora do escopo atual.
   - Depende de indices confiaveis, analise manual, historico, politica de privacidade especifica e estudo de permissoes Android.

## Prioridade inicial

A primeira entrega tecnica e fortalecer o modulo `modules/indicesKorre` com:

- tipos e servicos de sugestao;
- perfis de uso;
- custos padrao por tipo de veiculo;
- aplicacao segura de sugestoes sem sobrescrever dados do usuario.

