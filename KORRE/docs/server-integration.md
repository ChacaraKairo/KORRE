# Integração App x Servidor

## Endpoints principais
- `POST /mobile/devices/register`
- `POST /mobile/consents`
- `POST /mobile/data-sync/batches`
- `POST /mobile/backups`
- `GET /mobile/backups/latest`
- `DELETE /mobile/backups`
- `POST /mobile/commands/result`

## Comandos remotos permitidos
- `REQUEST_BACKUP_SYNC`
- `REQUEST_BACKUP_STATUS`
- `REQUEST_CONSENT_STATUS`
- `CREATE_NOTIFICATION`
- `SYNC_REMOTE_CONFIG`
- `GET_APP_STATUS`

## Comandos proibidos
- `RUN_SQL`
- `GET_RAW_DATABASE`
- `GET_PASSWORD`
- `GET_PASSWORD_HASH`
- `GET_CPF`
- `GET_PLATE`
- `GET_EMAIL`
