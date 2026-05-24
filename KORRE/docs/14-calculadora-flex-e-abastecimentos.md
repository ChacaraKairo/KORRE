# 14. Calculadora Flex e Abastecimentos

## Escopo
- Comparar gasolina x etanol.
- Registrar abastecimentos.

## Implementado atualmente
- Uso da calculadora sem login.
- Salvamento de abastecimento logado e deslogado.
- Campos de km, tipo combustível, litros/valor/preço, tanque cheio.
- Flags `criado_sem_login` e `vinculado_apos_cadastro`.

## Integrações
- Opção de lançar no financeiro quando logado.
- Base para cálculo de consumo real (`consumo_veiculo_periodo`).
- Eventos em `eventos_veiculo`.

## Consentimento
- `elegivel_estatistica` depende de consentimento de dados anônimos.

## Planejado
- Vinculação assistida pós-cadastro em mais fluxos.

## Riscos e cuidados
- Não exigir login para salvar abastecimento local.
