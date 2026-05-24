# Dados de Veiculos e Estatisticas (KORRE)

## O que e salvo
- Abastecimentos (`abastecimentos`)
- Consumo calculado por periodo (`consumo_veiculo_periodo`)
- Eventos estruturados do veiculo (`eventos_veiculo`)
- Dados de manutencao e financeiro ja existentes

## Dados sensiveis
- Nome, CPF, e-mail, telefone, senha/hash, placa, foto e localizacao exata sao sensiveis.
- Esses dados nao entram em visoes agregadas estatisticas.

## Dados anonimos/agregados elegiveis
- Tipo do veiculo, marca/modelo/ano (sem placa)
- Tipo de combustivel
- Consumo medio, custo por km, ticket medio, frequencia
- Custos medios de manutencao

## Dados que nunca saem do aparelho
- Registros individuais identificaveis
- Nome/CPF/e-mail/telefone/senha/hash/placa/foto
- Historico individual com identificador bruto

## Consentimento
- Chave local: `uso_dados_anonimos_estatisticas` (padrao `false`)
- O usuario pode ativar/desativar em Configuracoes > Privacidade e dados.
- Sem consentimento, `elegivel_estatistica = 0`.

## Abastecimento sem login
- Permitido salvar localmente (offline-first)
- Marca `criado_sem_login = 1`
- `veiculo_id` pode ficar `null`
- Depois de login/cadastro, registros podem ser vinculados ao veiculo

## Vinculacao apos cadastro/login
- Atualiza `veiculo_id`
- Marca `vinculado_apos_cadastro = 1`
- Mantem historico original

## Consumo real
- Calculado a partir de abastecimentos com km/litros/valor
- Confianca:
  - alta: dados consistentes + tanque cheio recorrente
  - media: dados suficientes sem tanque cheio recorrente
  - baixa: dados incompletos

## Backup
- Backup V9 inclui:
  - `abastecimentos`
  - `consumo_veiculo_periodo`
  - `eventos_veiculo`
- Continua compativel com backups anteriores.

## Regras para relatorios comerciais futuros
- Somente agregados e anonimos
- Sem nome, CPF, e-mail, telefone, placa ou identificador individual
- Sem envio automatico para servidor nesta fase
