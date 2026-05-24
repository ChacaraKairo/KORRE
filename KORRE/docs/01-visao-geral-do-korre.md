# 01. Visão Geral do KORRE

## O que é
KORRE é um app mobile para motoristas e entregadores acompanharem custo real de operação do veículo, lucro por corrida e saúde financeira do trabalho.

## Público-alvo
- Motoristas de app.
- Entregadores.
- Profissionais autônomos com veículo próprio, alugado ou financiado.

## Problema que resolve
- Falta de visibilidade de custo por km/minuto.
- Dificuldade de decidir corridas com base em lucro real.
- Falta de organização entre manutenção, financeiro e metas.

## Proposta de valor
- Cálculo orientado a custo real.
- Integração entre garagem, oficina, auditoria de índices e financeiro.
- Operação offline-first.

## Módulos principais
- Garagem e veículos.
- Financeiro (ganhos, despesas, metas).
- Oficina e manutenção.
- Auditoria KORRE e índices.
- Análise manual de corrida.
- Calculadora Flex e abastecimentos.
- Notificações.
- Backup/restauração.

## Implementado atualmente
- App Expo/React Native com SQLite local.
- Fluxos de cadastro/login local.
- Cálculos de viabilidade e histórico.
- Tabelas de abastecimento, consumo e eventos de veículo.
- Consentimento de dados anônimos e base de sincronização local.

## Planejado
- Sincronização com servidor KORRE Platform.
- Backup online consentido.
- Painel administrativo web/electron.

## Pendente
- Operação de produção com backend completo.
- Governança comercial de relatórios agregados.

## Riscos e cuidados
- Não misturar backup privado com analytics comercial.
- Evitar reidentificação em dados veiculares agregados.
