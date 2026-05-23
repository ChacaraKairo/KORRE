# Roadmap de Features — Índices KORRE, Custos, Oficina e Análise de Corridas

## 1. Objetivo do documento

Este documento organiza as próximas evoluções do KORRE em features independentes, com escopo, regras de negócio, impacto técnico, critérios de pronto e ordem recomendada de desenvolvimento.

A ideia central é evoluir o KORRE para que ele deixe de ser apenas um app de registro financeiro e passe a atuar como um assistente de decisão para motoristas, usando:

- índices de custo por quilômetro;
- índices de custo por minuto;
- meta de ganho por minuto;
- custos previstos cadastrados pelo usuário;
- dados reais vindos do financeiro;
- dados reais vindos da oficina;
- análise manual de corridas.

O monitoramento automático de tela fica fora do escopo atual. Nesta fase, o foco é permitir que o usuário digite manualmente os dados de uma corrida e receba a análise.

---

## 2. Estado atual considerado

O KORRE já possui uma base técnica boa para iniciar essas features:

- Projeto em Expo, React Native e TypeScript.
- Banco SQLite local (`korre.db`).
- Tabelas de veículos, parâmetros financeiros, transações financeiras, itens de manutenção e histórico de manutenção.
- Índices financeiros salvos no veículo:
  - `custo_km_calculado`;
  - `custo_minuto_calculado`;
  - `meta_ganho_minuto_calculado`;
  - `taxa_completude`.
- Módulo de índices parcialmente modularizado em `modules/indicesKorre`.
- Oficina já registra manutenção realizada e lança despesa financeira.
- Financeiro já registra ganhos e despesas por veículo/categoria.
- Hook de viabilidade já calcula se uma corrida vale a pena a partir de valor, tempo e distância.

O principal problema atual não está apenas no cálculo, mas na entrada dos dados. O usuário ainda precisa preencher muitos campos técnicos manualmente, o que pode tornar a experiência cansativa e gerar dúvidas.

---

## 3. Escopo atual

### Entra agora

- Melhorar o formulário de índices.
- Criar sugestões automáticas editáveis.
- Permitir pré-cadastro de custos de manutenção.
- Sincronizar custos planejados com a oficina.
- Usar dados financeiros reais no cálculo de custo.
- Criar qualidade/confiabilidade dos índices.
- Criar análise manual de corrida.
- Refatorar a lógica de decisão de corrida para um serviço reutilizável.

### Não entra agora

- Monitoramento de tela.
- Captura automática de dados de outros apps.
- OCR.
- Overlay sobre outros aplicativos.
- Serviço de acessibilidade.
- Automação em segundo plano.

Esses pontos podem ser planejados futuramente, depois que a base manual estiver confiável.

---

# Feature 1 — Auditoria KORRE / Formulário de Índices

## Objetivo

Transformar a calculadora atual em uma experiência guiada, simples e menos cansativa para o usuário.

O usuário não deve sentir que está preenchendo uma planilha técnica. Ele deve sentir que o KORRE está fazendo uma auditoria assistida e que ele só precisa revisar os dados principais.

## Problema atual

A tela de índices exige muitos campos técnicos, como:

- depreciação por km;
- manutenção imprevista por km;
- custo de oportunidade Selic;
- durabilidade de pneus;
- intervalo de freios;
- custos de transmissão;
- despesas recorrentes;
- rotina de trabalho.

Muitos usuários podem não saber preencher isso corretamente.

## Proposta

Criar uma experiência de auditoria guiada:

- modo simples;
- modo avançado;
- botão “Preencher para mim”;
- perfis de uso;
- resumo antes de salvar;
- explicações curtas no próprio formulário;
- qualidade da estimativa.

## Perfis de uso sugeridos

### Uso leve

Usuário roda pouco, alguns dias por semana.

Sugestões típicas:

- menos dias trabalhados;
- menos km por dia;
- menor reserva de manutenção;
- menor custo com alimentação.

### Uso médio

Usuário trabalha com frequência, mas não em ritmo extremo.

Sugestões típicas:

- rotina moderada;
- reserva média de manutenção;
- custos operacionais equilibrados.

### Uso intenso

Usuário usa o veículo quase todos os dias para ganhar dinheiro.

Sugestões típicas:

- mais km por dia;
- mais horas por dia;
- reserva maior de manutenção;
- maior custo de alimentação e limpeza.

### Uso profissional pesado

Usuário depende totalmente do veículo e trabalha muitas horas.

Sugestões típicas:

- alta quilometragem;
- alta reserva de manutenção;
- maior desgaste;
- maior margem de segurança.

## Regras de negócio

- O usuário pode preencher manualmente qualquer campo.
- O usuário pode aceitar sugestões do KORRE.
- O app nunca deve tratar uma sugestão como verdade absoluta.
- O app deve explicar que os valores são aproximados.
- O app deve permitir salvar mesmo com alguns campos incompletos, mas deve avisar que a precisão será menor.

## Critérios de pronto

- A tela não parece uma planilha extensa logo de início.
- O usuário consegue gerar índices preenchendo poucos campos essenciais.
- O usuário consegue abrir campos avançados se quiser mais precisão.
- O Dashboard continua recebendo os índices salvos.
- O app mostra a qualidade da auditoria.

---

# Feature 2 — Sugestões Automáticas de Custos

## Objetivo

Preencher automaticamente campos da auditoria com valores aproximados, baseados em dados do usuário, histórico do app e padrões conservadores.

## Proposta técnica

Criar um módulo de sugestões dentro de `modules/indicesKorre`:

```txt
modules/indicesKorre/suggestions/
  indicesSuggestionsService.ts
  suggestionTypes.ts
  vehicleUsageProfiles.ts
  vehicleDefaultCosts.ts
  applySuggestionsToForm.ts
```

## Tipos sugeridos

```ts
export type FonteSugestao =
  | 'usuario'
  | 'historico_oficina'
  | 'historico_financeiro'
  | 'pre_cadastro'
  | 'padrao_tipo_veiculo'
  | 'configuracao_app'
  | 'estimativa_korre';

export type ConfiancaSugestao = 'alta' | 'media' | 'baixa';

export interface SugestaoCampo {
  campo: keyof FormularioViabilidade;
  valor: number | string;
  fonte: FonteSugestao;
  confianca: ConfiancaSugestao;
  explicacao: string;
  aplicadoAutomaticamente: boolean;
}
```

## Ordem de prioridade das sugestões

1. Valor salvo pelo usuário.
2. Histórico real da oficina.
3. Histórico financeiro real.
4. Valor pré-cadastrado pelo usuário.
5. Sugestão por tipo de veículo.
6. Valor padrão conservador.

## Regra essencial

Valores já alterados ou salvos pelo usuário não devem ser sobrescritos automaticamente.

Se o KORRE tiver uma sugestão melhor, ele deve perguntar antes:

> “Encontramos dados reais mais recentes. Deseja atualizar sua auditoria?”

## Campos sugeridos para automação

- preço do combustível / energia;
- média de consumo;
- óleo e filtros;
- intervalo de óleo;
- pneus;
- durabilidade dos pneus;
- freios;
- intervalo dos freios;
- transmissão/correia;
- durabilidade da transmissão;
- manutenção imprevista;
- limpeza;
- depreciação;
- internet;
- smartphone;
- alimentação;
- dias trabalhados;
- horas por dia;
- km por dia;
- km estimado por mês.

## Critérios de pronto

- A auditoria consegue preencher campos vazios automaticamente.
- O usuário vê a origem da sugestão.
- O usuário pode editar qualquer sugestão.
- Sugestões não sobrescrevem valores salvos sem confirmação.

---

# Feature 3 — Pré-cadastro de Custos de Manutenção

## Objetivo

Permitir que o usuário cadastre custos previstos de manutenção, como pneus, óleo, freios e transmissão, sem que isso vire despesa real.

## Problema atual

Hoje, quando a manutenção é confirmada na oficina, o app:

- atualiza o item;
- grava histórico;
- lança despesa financeira.

Isso é correto para manutenção realizada, mas não serve para planejamento.

## Regra principal

Separar:

1. custo previsto;
2. item planejado na oficina;
3. manutenção realizada;
4. despesa real.

## Exemplo

O usuário informa na auditoria:

- pneus: R$ 900;
- durabilidade: 25.000 km.

O KORRE deve:

- usar esse valor no cálculo estimado;
- criar ou atualizar item “Pneus” na oficina;
- salvar intervalo de 25.000 km;
- salvar valor previsto de R$ 900;
- não lançar despesa;
- não criar histórico;
- não definir data de última troca;
- não considerar como manutenção já feita.

## Campos novos sugeridos em `itens_manutencao`

```sql
ALTER TABLE itens_manutencao ADD COLUMN valor_previsto REAL DEFAULT 0;
ALTER TABLE itens_manutencao ADD COLUMN origem TEXT DEFAULT 'manual';
ALTER TABLE itens_manutencao ADD COLUMN tem_historico_real INTEGER DEFAULT 0;
ALTER TABLE itens_manutencao ADD COLUMN computar_no_custo INTEGER DEFAULT 1;
```

## Estados possíveis do item na oficina

- Planejado;
- Sem dados reais;
- Em dia;
- Atenção;
- Urgente;
- Crítico;
- Vencido.

Para item planejado sem última troca:

> Planejado — aguardando primeira manutenção registrada.

## Critérios de pronto

- Usuário cadastra custo previsto na auditoria.
- O item aparece na oficina como planejado.
- Nenhum histórico é criado.
- Nenhuma despesa é lançada.
- Quando o usuário registra a manutenção, aí sim o app cria histórico e despesa.

---

# Feature 4 — Sincronização Auditoria ↔ Oficina

## Objetivo

Sincronizar automaticamente os custos de manutenção informados na auditoria com a oficina.

## Mapeamento inicial

| Campo da Auditoria | Item da Oficina |
|---|---|
| `valor_oleo_filtros` + `intervalo_oleo_filtros_km` | Óleo e filtros |
| `valor_jogo_pneus` + `durabilidade_pneus_km` | Pneus |
| `valor_manutencao_freios` + `intervalo_freios_km` | Freios |
| `valor_kit_transmissao` + `durabilidade_transmissao_km` | Transmissão / correia |
| `limpeza_higienizacao_mensal` | Limpeza, se for decidido controlar |

## Serviço recomendado

```txt
MaintenancePlanningService
```

## Responsabilidades

- Criar item planejado.
- Atualizar item planejado.
- Não criar histórico.
- Não lançar despesa.
- Preservar dados reais já registrados.
- Marcar origem como `auditoria`.
- Atualizar valor previsto e intervalo.

## Regras de preservação

- Se o item não existe, criar como planejado.
- Se existe e ainda não tem histórico real, pode atualizar valor previsto e intervalo.
- Se existe e já tem histórico real, não sobrescrever última troca.
- Se existe e já tem histórico real, sugerir atualização, mas não alterar sem confirmação.

## Critérios de pronto

- Salvar auditoria sincroniza oficina.
- Itens planejados aparecem na oficina.
- Itens reais não são apagados por estimativas.
- Oficina diferencia item planejado de item realizado.

---

# Feature 5 — Custo Real com Dados Financeiros

## Objetivo

Usar as despesas cadastradas pelo usuário no financeiro para melhorar os cálculos da auditoria.

## Problema atual

O custo depende muito do que o usuário informa no formulário.

Se o usuário já cadastra despesas reais, o KORRE deve usar isso para sugerir valores mais próximos da realidade.

## Proposta técnica

Criar módulo:

```txt
modules/indicesKorre/realCost/
  realCostService.ts
  realCostRepository.ts
  costCategoryMapper.ts
  realCostTypes.ts
```

## Dados analisados

- combustível;
- manutenção;
- alimentação;
- internet;
- seguro;
- limpeza;
- outras despesas recorrentes;
- despesas vinculadas ao veículo;
- médias dos últimos 30, 90 e 180 dias.

## Regras de cálculo

- Combustível entra no custo de movimento.
- Manutenção entra no custo de movimento ou reserva de manutenção.
- Alimentação entra no custo humano/tempo.
- Internet e smartphone entram no custo fixo/tempo.
- Seguro e licenciamento entram no custo de existência.
- Despesas sem veículo vinculado não devem ser aplicadas automaticamente ao veículo.

## Critérios de pronto

- O KORRE consegue sugerir custos com base no financeiro.
- O usuário vê “baseado nos seus últimos gastos”.
- O usuário pode aceitar ou ignorar a sugestão.
- O app diferencia valor manual, valor sugerido e valor real.

---

# Feature 6 — Histórico e Qualidade dos Índices

## Objetivo

Registrar a evolução dos índices e informar ao usuário o nível de confiança do cálculo.

## Problema atual

O veículo guarda apenas os índices atuais:

- custo por km;
- custo por minuto;
- meta por minuto;
- taxa de completude.

Não há histórico nem explicação da base usada no cálculo.

## Nova tabela sugerida

```sql
CREATE TABLE IF NOT EXISTS historico_indices_korre (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  veiculo_id INTEGER NOT NULL,
  custo_km REAL DEFAULT 0,
  custo_minuto REAL DEFAULT 0,
  meta_minuto REAL DEFAULT 0,
  taxa_completude REAL DEFAULT 0,
  nivel_confianca TEXT DEFAULT 'baixa',
  fonte_calculo TEXT DEFAULT 'manual',
  dados_resumo_json TEXT,
  data_calculo DATETIME DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (veiculo_id) REFERENCES veiculos (id) ON DELETE CASCADE
);
```

## Campos opcionais em `veiculos`

```sql
ALTER TABLE veiculos ADD COLUMN data_ultima_atualizacao_indices DATETIME;
ALTER TABLE veiculos ADD COLUMN nivel_confianca_indices TEXT DEFAULT 'baixa';
ALTER TABLE veiculos ADD COLUMN fonte_indices TEXT DEFAULT 'manual';
```

## Níveis de confiança

### Baixa

Poucos dados preenchidos. Índice inicial.

### Média

Dados principais preenchidos ou sugeridos.

### Alta

Cálculo baseado em histórico financeiro e oficina real.

## Critérios de pronto

- Dashboard mostra a qualidade dos índices.
- App informa quando os índices estão desatualizados.
- App cria histórico ao recalcular.
- Usuário entende a confiabilidade do número.

---

# Feature 7 — Análise Manual de Corrida

## Objetivo

Permitir que o usuário digite manualmente os dados de uma corrida e receba uma decisão financeira.

Esta feature substitui, por enquanto, qualquer ideia de monitoramento automático de tela.

## Campos do formulário

- Valor oferecido pela corrida.
- Tempo total estimado.
- KM até o local de embarque.
- KM da viagem até o destino final.

## Cálculos

```txt
Distância total = km até embarque + km da viagem
Custo distância = distância total × custo por km
Custo tempo = tempo total × custo por minuto
Custo total = custo distância + custo tempo
Lucro líquido = valor oferecido - custo total
Lucro por hora = lucro líquido / tempo × 60
```

## Resultado esperado

O KORRE deve mostrar:

- decisão;
- valor da corrida;
- custo estimado;
- lucro líquido;
- lucro por hora;
- explicação curta.

## Possíveis decisões

- Ideal;
- Aceitável;
- Fraca;
- Tóxica;
- Prejuízo.

## Regras iniciais

### Prejuízo

Lucro líquido menor ou igual a zero.

### Tóxica

Dá lucro, mas fica muito abaixo da meta do usuário.

### Fraca

Fica abaixo da meta, mas ainda não é tão ruim.

### Aceitável

Bate a meta mínima.

### Ideal

Fica bem acima da meta.

## Tela sugerida

```txt
app/(tabs)/analisar_corrida.tsx
```

Ou, em módulo:

```txt
modules/rideAnalyzer/
  domain/
    rideAnalyzerTypes.ts
    rideDecisionService.ts
  hooks/
    useRideAnalyzer.ts
  screens/
    RideAnalyzerScreen.tsx
```

## Critérios de pronto

- Usuário informa os 4 campos.
- App usa os índices do veículo ativo.
- App mostra se vale ou não vale a pena.
- App mostra motivo da decisão.
- Se os índices estiverem zerados, app orienta fazer a Auditoria KORRE primeiro.

---

# Feature 8 — Motor de Decisão de Corridas

## Objetivo

Separar a lógica de decisão de corrida em um serviço puro, reutilizável e testável.

O hook ou a tela não devem conter a regra principal de cálculo.

## Serviço recomendado

```txt
modules/rideDecision/domain/rideDecisionService.ts
```

## Entrada

```ts
export interface RideOfferInput {
  valorOferecido: number;
  distanciaAteEmbarqueKm: number;
  distanciaViagemKm: number;
  tempoTotalMinutos: number;
  custoKm: number;
  custoMinuto: number;
  metaMinuto: number;
  margemSegurancaPercentual?: number;
}
```

## Saída

```ts
export interface RideDecisionResult {
  distanciaTotalKm: number;
  custoDistancia: number;
  custoTempo: number;
  custoTotal: number;
  lucroLiquido: number;
  lucroPorHora: number;
  lucroPorMinuto: number;
  decisao: 'ideal' | 'aceitavel' | 'fraca' | 'toxica' | 'prejuizo';
  mensagem: string;
  motivo: string;
}
```

## Critérios de pronto

- Serviço não depende de React.
- Serviço não depende de tela.
- Serviço possui testes unitários.
- Serviço pode ser usado pela análise manual agora e por um monitor futuro depois.

---

# Feature 9 — Histórico de Análises de Corridas

## Objetivo

Registrar as análises feitas pelo usuário para gerar aprendizado e relatórios futuros.

## Nova tabela sugerida

```sql
CREATE TABLE IF NOT EXISTS analises_corrida (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  veiculo_id INTEGER,
  plataforma TEXT,
  valor_oferecido REAL NOT NULL,
  distancia_embarque_km REAL DEFAULT 0,
  distancia_corrida_km REAL DEFAULT 0,
  tempo_total_minutos REAL DEFAULT 0,
  custo_estimado REAL DEFAULT 0,
  lucro_estimado REAL DEFAULT 0,
  lucro_por_hora REAL DEFAULT 0,
  decisao TEXT NOT NULL,
  aceita_pelo_usuario INTEGER,
  data_analise DATETIME DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (veiculo_id) REFERENCES veiculos (id) ON DELETE SET NULL
);
```

## Uso futuro

- Mostrar quantas corridas foram boas.
- Mostrar quantas corridas foram ruins.
- Mostrar padrões por plataforma.
- Comparar decisões com ganhos reais registrados.
- Melhorar o aprendizado do app.

## Critérios de pronto

- App salva cada análise quando o usuário quiser.
- Usuário consegue consultar histórico básico.
- Histórico não é obrigatório para usar a análise manual.

---

# Feature 10 — Aprendizado com Dados Reais

## Objetivo

Fazer o KORRE melhorar os índices com base no uso real do app.

## Regras

O app deve comparar:

- custo previsto vs custo real;
- manutenção prevista vs manutenção realizada;
- despesas médias estimadas vs despesas cadastradas;
- meta esperada vs resultado real.

## Exemplos de alertas

> Seus gastos reais de manutenção estão 22% acima da estimativa. Deseja revisar seus índices?

> Você registrou novas despesas de combustível. Deseja atualizar o custo por km?

> Seu padrão de uso mudou. Sua quilometragem mensal parece maior que a informada na auditoria.

## Critérios de pronto

- O app detecta divergências relevantes.
- O app sugere atualização dos índices.
- Nada é alterado automaticamente sem confirmação do usuário.

---

# Feature 11 — Monitor de Tela de Corridas

## Status

Futuro. Fora do escopo atual.

## Objetivo futuro

Monitorar automaticamente ofertas de corrida na tela e preencher os dados da análise sem o usuário digitar manualmente.

## Dependências

Antes dessa feature, é necessário concluir:

- Análise Manual de Corrida;
- Motor de Decisão de Corridas;
- Índices confiáveis;
- Histórico de análises;
- Política de privacidade específica;
- Estudo de permissões Android.

## Observação

O monitor de tela deve ser tratado com cuidado por envolver permissões sensíveis, transparência, privacidade e regras de loja.

---

# Ordem recomendada de desenvolvimento

## Fase 1 — Melhorar a base dos índices

1. Feature 1 — Auditoria KORRE / Formulário de Índices.
2. Feature 2 — Sugestões Automáticas de Custos.
3. Feature 3 — Pré-cadastro de Custos de Manutenção.
4. Feature 4 — Sincronização Auditoria ↔ Oficina.

## Fase 2 — Tornar o custo mais real

5. Feature 5 — Custo Real com Dados Financeiros.
6. Feature 6 — Histórico e Qualidade dos Índices.
10. Feature 10 — Aprendizado com Dados Reais.

## Fase 3 — Analisar corridas manualmente

7. Feature 7 — Análise Manual de Corrida.
8. Feature 8 — Motor de Decisão de Corridas.
9. Feature 9 — Histórico de Análises de Corridas.

## Fase 4 — Futuro

11. Feature 11 — Monitor de Tela de Corridas.

---

# Prioridade inicial recomendada

A primeira entrega deve ser:

```txt
Feature 1 — Auditoria KORRE / Formulário de Índices
```

Em seguida:

```txt
Feature 2 — Sugestões Automáticas de Custos
Feature 3 — Pré-cadastro de Custos de Manutenção
Feature 4 — Sincronização Auditoria ↔ Oficina
```

Essas features deixam os índices mais fáceis de configurar e mais úteis para o usuário.

Depois disso, a análise manual de corrida terá uma base muito mais confiável.

---

# Regra conceitual final

A regra principal do KORRE deve ser:

```txt
Auditoria planeja.
Oficina acompanha.
Financeiro registra a realidade.
Índices calculam o custo.
Análise de corrida decide se vale a pena.
```

Essa separação evita confusão entre custo previsto e gasto real, melhora a experiência do usuário e prepara o KORRE para evoluções futuras.
