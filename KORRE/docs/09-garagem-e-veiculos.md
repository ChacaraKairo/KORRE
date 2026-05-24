# 09. Garagem e Veículos

## Objetivo
Centralizar os dados do veículo ativo que alimentam financeiro, oficina, auditoria e análise de corrida.

## Implementado atualmente
- Cadastro de veículo (tipo, marca, modelo, ano, motor, placa).
- Seleção de veículo ativo.
- Atualização de km atual.
- Cache de índices calculados no próprio registro do veículo.

## Relações de negócio
- Garagem → Auditoria KORRE: custo/km, custo/minuto e completude.
- Garagem → Oficina: itens e histórico por `veiculo_id`.
- Garagem → Financeiro: transações vinculadas ao veículo.
- Garagem → Abastecimentos: consumo real por veículo.

## Planejado
- Mapeamento com `serverDeviceId`/`serverUserId` no backend.

## Pendente
- Padronização de qualidade de dados em placa e km.

## Riscos e cuidados
- Placa é dado pessoal sensível; não usar em analytics.
