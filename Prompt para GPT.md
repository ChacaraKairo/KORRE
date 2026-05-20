# PROMPT — Auditoria técnica completa e relatório sênior do repositório KORRE

Atue como uma equipe sênior composta por:

- Desenvolvedor Mobile Sênior React Native/Expo;
- Analista de Sistemas Sênior;
- Engenheiro de Software Sênior;
- Arquiteto de Software;
- Especialista em Segurança Mobile;
- Especialista em UX/Product Quality;
- Revisor técnico para lançamento em produção.

Você deve analisar o repositório **KORRE** de forma completa, minuciosa e profissional.

O app KORRE é um aplicativo mobile offline-first para motoristas e entregadores, focado em inteligência financeira (Semáforo de Corridas, IKM, IMIN), com controle de ganhos, despesas, veículos (custos de capital e existência), manutenção, metas, backup, relatórios (DRE, MEI), notificações, login local, cadastro e suporte. O app utiliza React Native, Expo (com Expo Router), SQLite (local), i18next para internacionalização e Reanimated para animações.

---

## Objetivo principal

Realizar uma auditoria completa do repositório e gerar um relatório extremamente detalhado contendo:

1. Tudo que o app já possui implementado.
2. O que parece estar finalizado.
3. O que está parcialmente implementado.
4. O que precisa de atenção.
5. O que está vulnerável ou frágil.
6. O que não está configurado em padrão profissional de mercado.
7. O que falta implementar antes de beta.
8. O que falta implementar antes de produção.
9. Onde exatamente alterar código.
10. Quais arquivos criar.
11. Quais arquivos modificar.
12. Quais riscos existem se nada for alterado.
13. Qual deve ser a ordem ideal de correção.

---

# Regras obrigatórias antes de começar

## Não implemente nada nesta primeira etapa

Nesta tarefa, você deve **apenas analisar e gerar relatório**.

Não altere código.
Não crie arquivos.
Não faça commits.
Não delete arquivos.
Não instale dependências.
Não refatore nada.

O objetivo agora é diagnóstico completo e planejamento técnico.

Depois o relatório será usado para criar prompts menores de implementação.

---

## Profundidade esperada da análise

Não faça uma análise superficial.

Você deve abrir, ler e correlacionar arquivos do projeto inteiro, incluindo:

- telas;
- hooks;
- services;
- database;
- repositories;
- migrations;
- constants;
- config;
- utils;
- components;
- styles;
- assets;
- locales;
- notifications;
- auth;
- backup;
- rotas;
- README;
- package.json;
- app.json ou app.config.ts;
- eas.json;
- .env.example;
- workflows de CI;
- testes;
- políticas e termos;
- qualquer documentação existente.

Se encontrar uma pasta importante, analise o conteúdo dela.

---

# Áreas obrigatórias de auditoria

## 1. Visão geral do produto

Analise e descreva:

- Qual é o propósito real do app.
- Qual público o app atende.
- Quais módulos principais existem.
- Quais fluxos principais já estão implementados.
- Qual o nível de maturidade atual: protótipo, MVP, beta técnico, beta público ou produção.
- Quais funcionalidades parecem prontas.
- Quais funcionalidades parecem incompletas.

---

## 2. Arquitetura do projeto

Analise:

- Estrutura de pastas.
- Separação entre tela, hook, service, repository, utilitário e componente.
- Se há duplicação de responsabilidades.
- Se há arquivos grandes demais.
- Se há código de domínio dentro de telas.
- Se hooks estão fazendo trabalho demais.
- Se services estão bem definidos.
- Se existe padrão consistente no projeto.
- Se a arquitetura está adequada para manutenção e crescimento.

Para cada problema, informe:

```txt
Problema:
Impacto:
Arquivo(s):
Como corrigir:
Prioridade:
```

---

## 3. Banco de dados SQLite

Analise profundamente:

- Arquivo de inicialização do banco.
- Migrations.
- `PRAGMA user_version`.
- `foreign_keys`.
- `WAL`.
- Tabelas existentes.
- Relacionamentos.
- Índices.
- Risco de perda de dados.
- Risco de inconsistência.
- Campos ausentes.
- Campos que deveriam ser obrigatórios.
- Uso de `DELETE`, `DROP`, `INSERT OR REPLACE` e impacto na sincronização ou integridade (ex: apagar veículo e quebrar histórico financeiro).
- Compatibilidade de backup/restore.
- Se migrations são idempotentes.
- Se o banco suporta atualização de versões futuras.

Gerar uma seção com:

```md
## Banco de dados — diagnóstico

### Tabelas encontradas

| Tabela | Função | Observações | Riscos |

### Problemas encontrados

| Prioridade | Problema | Arquivo | Correção recomendada |

### Sugestões de melhoria
```

---

## 4. Autenticação e segurança

Analise:

- Cadastro.
- Login.
- Armazenamento de senha.
- Hash de senha.
- Salt.
- Iterações.
- Compatibilidade com hashes antigos.
- Bloqueio por tentativas.
- Biometria.
- Recuperação de senha.
- Logout.
- Risco de burlar autenticação.
- Mensagens que revelam dados sensíveis.
- Logs com dados sensíveis.
- Dados pessoais salvos localmente.
- Dados exportados em backup.
- Restore de dados sensíveis.
- Se existe algum serviço de analytics/crashlytics de terceiros violando a política de `PRIVACY_POLICY.md` (offline-first, sem compartilhamento não autorizado).
- Permissões de câmera, arquivos e notificações.

Classifique riscos como:

- Crítico;
- Alto;
- Médio;
- Baixo.

Para cada risco, informe:

```txt
Risco:
Cenário de problema:
Arquivo(s):
Linha/função provável:
Correção recomendada:
Esforço estimado:
```

---

## 5. Backup e restauração

Analise:

- Como o backup é exportado.
- Quais tabelas entram no backup.
- Quais colunas são excluídas.
- Se senha é exportada.
- Se dados pessoais são exportados.
- Se o backup é criptografado.
- Se o restore valida o arquivo antes de apagar dados.
- Se usa transação.
- Se restaura dados incompatíveis.
- Se backup antigo continua compatível.
- Se há risco de corromper banco.
- Se há aviso claro para o usuário.
- Se há registro de último backup.
- Se o fluxo é adequado para produção.

No relatório, inclua:

```md
## Backup e restauração

### O que já está bom

### Pontos vulneráveis

### O que falta para padrão profissional

### Arquivos que precisam ser alterados

| Arquivo | Alteração necessária | Motivo |
```

---

## 6. Tela de suporte e contatos oficiais da empresa

Essa área é prioritária.

Analise a página de suporte e qualquer uso de dados de contato.

Verifique:

- WhatsApp.
- YouTube.
- E-mail.
- Site oficial.
- Instagram.
- Política de privacidade.
- Termos de uso.
- Nome da empresa.
- Textos de prazo de resposta.
- Promessas irreais.
- Dados hardcoded.
- Dados fictícios.
- Dados vindos de `.env`.
- Ausência de arquivo central de contatos.

O app deve ter um arquivo central onde o proprietário colocará os meios oficiais de contato da empresa.

Proponha a criação de algo como:

```txt
KORRE/config/companyContacts.ts
```

ou outra estrutura mais adequada.

O relatório deve especificar:

````md
## Contatos oficiais e suporte

### Problema atual

Explique onde existem dados irreais, placeholders ou configuração frágil.

### Arquivo central recomendado

Caminho:
KORRE/config/companyContacts.ts

Conteúdo recomendado:

```ts
export const COMPANY_CONTACTS = {
  companyName: 'Koru Company',
  support: {
    email: '',
    whatsappNumber: '',
    whatsappMessage:
      'Olá! Preciso de suporte com o app KORRE.',
    youtubeUrl: '',
    websiteUrl: '',
    instagramUrl: '',
    privacyPolicyUrl: '',
    termsOfUseUrl: '',
  },
  legal: {
    responsibleName: '',
    document: '',
    address: '',
    country: 'Brasil',
  },
  app: {
    appName: 'KORRE',
    publicVersionLabel: '',
  },
} as const;
```
````

### Arquivos que devem consumir esse arquivo

Liste todos.

### Comportamento esperado

Explique o que a tela deve fazer quando um canal estiver vazio.

````

---

## 7. Configurações e ambiente

Analise:

- `.env.example`;
- uso de `process.env`;
- variáveis `EXPO_PUBLIC_*`;
- dados que deveriam ser variáveis;
- dados que não deveriam estar em `.env`;
- dados que deveriam ficar em arquivo de configuração;
- configurações de suporte;
- configurações de API;
- remote commands;
- build profiles;
- ambiente dev, preview e production.

Gerar tabela:

```md
| Configuração | Onde está hoje | Problema | Recomendação |
````

---

## 8. Notificações e comandos remotos

Analise:

- Push notification.
- Registro de dispositivo.
- Uso de API base URL.
- Remote command handler.
- Validação de payload.
- Logs de comandos remotos.
- Se comandos remotos estão desligados por padrão.
- Se há risco de comando remoto acessar dados sensíveis.
- Se há autenticação real.
- Se falhas de rede são tratadas.
- Se push token é salvo corretamente.

Informe:

```md
## Notificações e comandos remotos

### Pronto para produção?

Sim/Não, justificando.

### Riscos encontrados

### Recomendações
```

---

## 9. Fluxo financeiro

Analise:

- Registro de ganhos.
- Registro de despesas.
- Categorias financeiras.
- Origens de ganho.
- Tela de origens de ganho.
- Relação entre origem de ganho e categoria.
- Se a tela de registro financeiro mostra categorias corretas.
- Se ganhos mostram apenas origens selecionadas pelo usuário.
- Se despesas continuam independentes.
- Se há duplicidade de categorias.
- Se exclusão de categoria quebra histórico.
- Se `categoria_id` é salvo corretamente.
- Se relatórios usam corretamente as categorias.

Regra de negócio importante:

```txt
Na tela de registro financeiro, quando o tipo for GANHO, devem aparecer somente as origens de ganho selecionadas/cadastradas pelo usuário na tela de Origens de Ganho.
Não devem aparecer todas as categorias possíveis de ganho.
```

O relatório deve dizer se essa regra já está implementada ou não.

Se não estiver, indicar:

- arquivo da tela;
- hook;
- service/repository;
- tabela envolvida;
- query necessária;
- comportamento esperado;
- risco de duplicidade;
- testes manuais.

---

## 9.5 Motor de Viabilidade e Semáforo (Core do App)

Analise profundamente a lógica de cálculo (ex: `useViabilidade.ts` e Tipos):

- Cálculo correto de `IKM` (Custo por KM) e `IMIN` (Custo por Minuto).
- Tratamento de divisão por zero (ex: tempo estimado = 0).
- Atualização em tempo real do Semáforo.
- Estrutura de Custos (Capital, Existência, Ativo, Pessoa).
- Vinculação correta desses índices ao veículo ATIVO (`veiculos WHERE ativo = 1`).
- Consistência de tipos TypeScript em todo o motor.
- Risco de gargalo de performance ou re-renderizações desnecessárias ao chamar `avaliarCorrida`.

O relatório deve apontar fragilidades matemáticas, tipagens inseguras ou problemas de UX no motor de cálculo.

---

## 10. Veículos, oficina e manutenção

Analise:

- Cadastro de veículo.
- Tipos de veículo.
- Campos obrigatórios por tipo.
- Bicicleta, moto, carro, van, elétrico.
- Oficina.
- Itens de manutenção.
- Histórico de manutenção.
- Alertas.
- Cálculo de vencimento por km/data.
- Risco de dados inválidos.
- Regras de negócio inconsistentes.

Gerar diagnóstico do que está pronto e do que precisa melhorar.

---

## 11. Relatórios e cálculos

Analise:

- Relatórios financeiros.
- Receita por plataforma.
- MEI.
- Carne-leão.
- Consumo.
- Manutenções.
- DRE/balanço.
- Produtividade.
- Fórmulas usadas.
- Datas e filtros.
- Risco de cálculo errado (especialmente cálculos complexos como depreciação, lucro líquido real por hora, etc).
- Valores nulos.
- Divisão por zero.
- Filtros por veículo.
- Filtros por período.
- Performance das queries.

Informe se os relatórios estão prontos para usuário real ou se ainda precisam de revisão.

---

## 12. Internacionalização

Analise:

- Arquivos em `locales`.
- Chaves faltantes.
- Chaves não usadas.
- Textos hardcoded dentro de componentes e navegação.
- Mistura de português de Portugal e português do Brasil.
- Inglês, espanhol e francês.
- Se todos os textos de suporte, financeiro, login, cadastro e configurações usam `t()`.
- Chaves dinâmicas construídas no código (ex: arrays de frases de dashboard em `frasesService.ts`) que possam quebrar a tradução.
- Se há traduções incompletas ou inconsistentes.

Gerar tabela:

```md
| Idioma | Status | Problemas | Ação recomendada |
```

---

## 13. UX, mensagens e profissionalismo

Analise:

- Alertas.
- Mensagens de erro.
- Textos em tela.
- Estados vazios.
- Loading.
- Botões.
- Promessas irreais.
- Texto informal demais.
- Dados de exemplo.
- Fluxos confusos.
- Telas sem feedback.
- Possível frustração do usuário.

Classifique:

- aceitável;
- precisa melhorar antes do beta;
- precisa melhorar antes de produção.

---

## 14. Rotas e navegação

Analise:

- Expo Router (estrutura em diretórios `app/`).
- `AppRoutes`.
- Rotas hardcoded.
- `router.push`.
- `router.replace`.
- `safeBack`.
- Fluxos de auth.
- Redirecionamento depois de cadastro.
- Redirecionamento depois de restore e controle da tela de Splash Screen (`useSplash`).
- Acesso indevido a telas internas sem cadastro.

Apontar rotas frágeis e como corrigir.

---

## 15. Build, publicação e loja

Analise:

- `package.json`;
- scripts;
- `app.json` ou `app.config.ts`;
- `eas.json`;
- versionamento;
- Android package;
- ícones;
- splash;
- permissões;
- política de privacidade;
- termos;
- README;
- CI;
- testes;
- requisitos da Play Store.

Gerar:

```md
## Prontidão para publicação

| Item | Status | Observação |
```

Status possíveis:

- OK;
- Parcial;
- Ausente;
- Precisa revisar;
- Crítico.

---

## 16. Testes e qualidade

Analise:

- testes existentes;
- cobertura dos módulos críticos;
- scripts `test`, `typecheck`, `lint`, `validate`;
- Testes unitários focados nas lógicas matemáticas (Calculadora de Viabilidade);
- CI;
- ausência de testes;
- testes que deveriam existir.

Liste testes recomendados por módulo:

```md
| Módulo | Teste necessário | Prioridade |
```

---

## 17. Performance

Analise:

- Queries pesadas.
- Re-renderizações.
- Hooks com `useEffect` problemático.
- `useFocusEffect`.
- Listas grandes.
- Falta de paginação.
- Animações (uso correto de `react-native-reanimated`, ex: hooks na thread UI, sem bloquear a thread JS).
- Falta de índices.
- Carregamento inicial.
- Operações síncronas pesadas.
- Loops em JS.
- Backup/restauração com muitos dados.

---

## 18. Logs e tratamento de erros

Analise:

- `console.log`;
- `console.error`;
- `logger`;
- `Alert.alert`;
- mensagens técnicas ao usuário;
- logs com dados sensíveis;
- `catch` vazios;
- `throw` sem tratamento.

Gerar recomendações claras.

---

## 19. Assets, identidade e aparência

Analise:

- ícone;
- splash;
- imagens;
- fontes;
- consistência visual;
- modo claro/escuro;
- cores hardcoded;
- contraste;
- acessibilidade básica;
- textos cortados;
- responsividade.

---

## 20. Documentação

Analise:

- README principal;
- README técnico;
- políticas;
- termos;
- docs existentes;
- instruções de setup;
- instruções de build;
- instruções de validação;
- documentação de variáveis de ambiente;
- documentação de banco/backup.

Indique o que falta documentar.

---

# Formato obrigatório do relatório final

Crie um relatório em Markdown com o seguinte formato:

```md
# Relatório técnico completo — Auditoria KORRE

## 1. Resumo executivo

## 2. Status geral do app

### 2.1 O que já existe

### 2.2 O que parece finalizado

### 2.3 O que está parcial

### 2.4 O que falta implementar

## 3. Mapa de funcionalidades

| Funcionalidade | Status | Arquivos principais | Observações |

## 4. Mapa técnico do repositório

| Pasta/Arquivo | Função | Qualidade atual | Observações |

## 5. Problemas críticos encontrados

| Prioridade | Problema | Impacto | Arquivo(s) | Correção recomendada |

## 6. Segurança

## 7. Banco de dados

## 8. Backup e restauração

## 9. Suporte e contatos oficiais

## 10. Configurações e ambiente

## 11. Financeiro e origens de ganho

### 11.1 Motor de Viabilidade e Semáforo

## 12. Veículos e manutenção

## 13. Relatórios e cálculos

## 14. Internacionalização

## 15. Navegação e rotas

## 16. UX e mensagens

## 17. Build e publicação

## 18. Testes e qualidade

## 19. Performance

## 20. Logs e erros

## 21. Documentação

## 22. Plano de ação por prioridade

### P0 — Crítico antes de qualquer beta

| Tarefa | Arquivo(s) | O que alterar | Risco se não fizer |

### P1 — Necessário antes de beta público

| Tarefa | Arquivo(s) | O que alterar | Risco se não fizer |

### P2 — Necessário antes de produção

| Tarefa | Arquivo(s) | O que alterar | Risco se não fizer |

### P3 — Melhorias futuras

| Tarefa | Arquivo(s) | O que alterar | Benefício |

## 23. Arquivos que devem ser criados

| Caminho | Objetivo | Conteúdo esperado |

## 24. Arquivos que devem ser alterados

| Arquivo | Alteração necessária | Motivo | Prioridade |

## 25. Sugestão de ordem de implementação

Liste em ordem segura, do menor risco para o maior risco.

## 26. Checklist final de validação

Liste testes manuais e comandos técnicos.
```

---

# Critérios de status

Use estes status:

```txt
Finalizado
Funcional, mas precisa revisar
Parcial
Frágil
Ausente
Crítico
Não avaliado por falta de evidência
```

Não marque algo como finalizado sem evidência no código.

---

# Critérios de prioridade

Use:

```txt
P0 — Crítico: pode causar perda de dados, falha de segurança, bloqueio de lançamento ou quebra grave.
P1 — Alto: necessário para beta confiável.
P2 — Médio: necessário para produção profissional.
P3 — Baixo: melhoria futura.
```

---

# Exigência de precisão

Para cada recomendação importante, cite:

- arquivo exato;
- função/componente provável;
- pasta;
- motivo técnico;
- impacto;
- sugestão objetiva de correção.

Exemplo:

```md
### Problema: contatos de suporte hardcoded ou irreais

Prioridade: P1

Arquivos:

- KORRE/app/(tabs)/suporte.tsx
- KORRE/locales/pt.json
- KORRE/locales/en.json
- KORRE/locales/es.json
- KORRE/.env.example

Impacto:
O usuário pode ver canais de suporte não configurados ou promessas não garantidas, reduzindo confiança e podendo gerar problema na publicação.

Correção recomendada:
Criar `KORRE/config/companyContacts.ts` e fazer a tela de suporte renderizar somente canais preenchidos.
```

---

# Não invente informações

Se não encontrar evidência no código, escreva:

```txt
Não foi possível confirmar pelo código analisado.
```

Não assuma que algo está pronto apenas porque existe nome de arquivo.

---

# Resultado final esperado

Ao terminar, entregue apenas o relatório técnico completo.

Não implemente código nesta etapa.
Não faça commit.
Não modifique arquivos.

O relatório precisa ser detalhado o suficiente para que outro agente de IA consiga implementar as correções depois, etapa por etapa, sem precisar redescobrir o problema.

```

Esse prompt é melhor para a fase atual porque ele força a IA a atuar como **auditor técnico**, não como “gerador de código”. Depois que ela gerar o relatório, a gente transforma cada bloco em prompts menores para implementação segura.
```
