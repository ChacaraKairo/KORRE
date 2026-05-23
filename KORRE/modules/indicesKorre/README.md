# Modulo indicesKorre

Este modulo concentra a geracao dos indices KORRE e o formulario da calculadora.

## Estrutura

- `domain/`
  - Tipos do formulario e da avaliacao de corridas.
  - Formulas puras de IKM, IMIN, metas e decisao.
  - Constantes e utilitarios numericos.
- `infra/`
  - Acesso ao SQLite para parametros financeiros, dados de oficina e cache dos indices no veiculo.
- `application/`
  - Orquestracao entre formulas e banco.
  - Ponto central para processar e salvar os indices.
- `hooks/`
  - Estado do formulario, troca de veiculo, preenchimento automatico e acoes da tela.
- `ui.ts`
  - Reexports dos componentes visuais usados pela tela da calculadora.

## Ponto de entrada

Use o barrel:

```ts
import { useIndicesKorreForm, IndicesKorreService } from '@/modules/indicesKorre';
```

Os caminhos antigos em `utils/`, `type/`, `hooks/calculadora/` e
`database/repositories/CalculadoraRepository.ts` continuam existindo como
adaptadores para compatibilidade, mas a evolucao nova deve acontecer aqui.

