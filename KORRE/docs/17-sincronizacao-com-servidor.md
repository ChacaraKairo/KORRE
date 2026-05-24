# 17. Sincronização com Servidor

## Fluxo alvo
1. App inicia offline.
2. Gera `localInstallationId`.
3. Quando online, handshake com servidor.
4. Recebe `serverDeviceId/serverDeviceCode` e segredo.
5. App guarda credenciais locais.
6. Monta lote seguro, anonimiza e valida.
7. Enfileira localmente (`sync_batches_local`) e envia.

## Implementado atualmente
- Base de sync no app: `modules/sync/*`.
- Queue local, anonymizer, payload builder, consent guard.

## Planejado
- Operação completa contra API de produção.
- Processamento de comandos remotos de sync.

## Pendente
- Estratégia final de reenvio e observabilidade.

## Riscos e cuidados
- Não enviar dados sensíveis.
- Respeitar limitações de background mobile.
