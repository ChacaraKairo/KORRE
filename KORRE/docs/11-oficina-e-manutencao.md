# 11. Oficina e Manutenção

## Estrutura
- `itens_manutencao`: plano por componente.
- `historico_manutencao`: eventos reais.

## Campos relevantes
- `valor_previsto`
- `origem`
- `tem_historico_real`
- `computar_no_custo`

## Implementado atualmente
- Manutenção planejada e manutenção real.
- Histórico e alertas de vencimento.
- Integração com Auditoria KORRE para sugestão de custos.

## Planejado
- Refinamento de sugestões com histórico financeiro.

## Pendente
- UX completa para primeira manutenção planejada em todos os cenários.

## Riscos e cuidados
- Não tratar item planejado como despesa efetiva.
