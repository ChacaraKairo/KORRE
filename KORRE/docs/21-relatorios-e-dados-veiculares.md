# 21. Relatórios e Dados Veiculares

## Casos de uso de inteligência de mercado (futuro)
- Tendência de consumo por tipo de veículo.
- Faixa de custo de manutenção por sistema.
- Durabilidade agregada de pneus/freios/óleo/transmissão.

## Dados úteis por segmento
- Montadoras: consumo e desgaste por perfil de uso.
- Oficinas: manutenção por faixa de km.
- Autopeças: ciclo de substituição agregado.
- Postos: ticket médio e combustível por região.

## Regras obrigatórias
- Somente dados agregados/anônimos.
- Grupo mínimo para evitar reidentificação.
- Proibido expor nome, CPF, e-mail, placa, telefone, senha.

## Implementado atualmente
- Base local de agregação/anonimização no app.

## Planejado
- Pipeline servidor para relatórios agregados.

## Riscos e cuidados
- Monitorar risco de identificação indireta por cruzamento de atributos.
