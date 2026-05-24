# 16. Privacidade, Consentimento e Dados

## Princípios
- Finalidade, minimização e transparência.
- Consentimento explícito para usos opcionais.

## Dados pessoais/sensíveis
- Nome, CPF, e-mail, senha, placa, foto, contato.
- Não devem entrar em analytics comercial.

## Consentimentos no app
- Estatísticas anônimas/agregadas.
- Backup online (planejado/em evolução).

## Implementado atualmente
- Controle de consentimento local para elegibilidade estatística.
- Serviços dedicados (`modules/privacy`, `DataConsentService`).

## Planejado
- Revogação e exclusão remota associadas ao servidor.

## Pendente
- Política operacional de retenção no backend.

## Riscos e cuidados
- Risco de reidentificação por combinação de atributos.
- Aplicar anonimização/agrupamento mínimo.
