# Dados de Veículos e Estatísticas no KORRE

## Dados salvos localmente
- `abastecimentos`
- `consumo_veiculo_periodo`
- `eventos_veiculo`
- `itens_manutencao`
- `historico_manutencao`
- `analises_corrida`

## Dados sensíveis
- nome
- CPF
- e-mail
- telefone
- senha/hash
- placa
- foto
- endereço e localização exata

## Dados que nunca podem sair do app
- qualquer identificador pessoal direto
- histórico bruto individual identificável
- IDs locais brutos de usuário e veículo

## Dados que podem virar estatística
- tipo de veículo, marca/modelo/ano
- tipo de combustível
- faixas de km e faixas de valor
- consumo médio
- custo combustível/km
- eventos de manutenção por sistema/categoria
- análises de corrida agregadas

## Consentimento
- Chave: `uso_dados_anonimos_estatisticas`
- Padrão: `false`
- Sem consentimento ativo: lote não é montado nem enviado.
- Consentimento pode ser revogado a qualquer momento.

## Abastecimento sem login
- Salva localmente com `criado_sem_login = 1`
- `veiculo_id` pode ficar `NULL`
- Pode ser vinculado depois ao veículo cadastrado

## Vínculo após cadastro/login
- Atualiza `veiculo_id`
- Marca `vinculado_apos_cadastro = 1`
- Mantém histórico do registro

## Consumo real
- Calculado a partir de abastecimentos e km
- Persistido em `consumo_veiculo_periodo`
- Confiança: `alta`, `media`, `baixa`

## Modelo de sync
1. Verifica consentimento.
2. Registra device público aleatório.
3. Monta payload agregado.
4. Anonimiza/remapeia campos sensíveis.
5. Salva em `sync_batches_local`.
6. Tenta envio quando API estiver configurada.

## Payload enviado ao servidor
- `batchPublicId`
- `devicePublicId`
- `appVersion`
- `databaseVersion`
- `consentVersion`
- `records[]` agregados

## Campos proibidos no payload
`cpf`, `documento`, `senha`, `password`, `hash`, `placa`, `plate`, `email`, `telefone`, `phone`, `nome`, `name`, `foto`, `photo`, `endereco`, `address`, `latitude`, `longitude`, `gps`, `route`, `rawUser`, `rawVehicle`.

## Regras de anonimização
- `km_atual` exato -> faixa (`20000-29999`)
- data exata -> mês (`YYYY-MM`)
- valor sensível -> faixa de valor
- remoção de IDs locais
- remoção de campos proibidos

## Regras para relatórios comerciais futuros
- somente dados agregados e anônimos
- sem reidentificação individual
- sem atributos sensíveis pessoais
- sempre com consentimento explícito do usuário
