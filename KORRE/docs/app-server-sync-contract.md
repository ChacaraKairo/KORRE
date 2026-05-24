# KORRE App-Server Sync Contract

## Endpoints esperados
- `POST /mobile/devices/register`
- `POST /mobile/consents`
- `POST /mobile/data-sync/batches`
- `POST /mobile/commands/result`

## Comandos remotos suportados
- `REQUEST_DATA_SYNC`
- `REQUEST_CONSENT_STATUS`
- `CREATE_NOTIFICATION`
- `SYNC_REMOTE_CONFIG`
- `GET_APP_STATUS`

## Formato REQUEST_DATA_SYNC
```json
{
  "requestId": "req_123",
  "command": "REQUEST_DATA_SYNC",
  "payload": {
    "dataset": "vehicle_analytics"
  }
}
```

## Formato batch seguro
```json
{
  "batchPublicId": "batch_x",
  "devicePublicId": "dev_x",
  "appVersion": "1.3.1",
  "databaseVersion": 10,
  "consentVersion": "2026-05-24",
  "createdAt": "2026-05-24T12:00:00.000Z",
  "records": [
    {
      "type": "fuel_entry",
      "vehicleProfile": {
        "vehicleType": "moto",
        "brand": "Honda",
        "model": "CG 160",
        "year": 2023,
        "fuelType": "gasolina",
        "stateUf": "SP",
        "kmRange": "20000-29999"
      },
      "metrics": {
        "liters": 8.5,
        "totalValueRange": "50-99",
        "unitPrice": 6.11,
        "fullTank": true,
        "periodMonth": "2026-05"
      }
    }
  ]
}
```

## Resposta do app para comando
```json
{
  "requestId": "req_123",
  "command": "REQUEST_DATA_SYNC",
  "success": true,
  "data": {
    "sent": 1,
    "pending": 0
  }
}
```

## Erros possíveis
- `consent_required`
- `invalid_payload`
- `forbidden_field:*`
- `network_error`
- `api_not_configured`

## Campos proibidos
Nunca enviar: `cpf`, `nome`, `email`, `telefone`, `senha`, `hash`, `placa`, `foto`, `endereco`, `latitude`, `longitude`, `route`, `rawUser`, `rawVehicle`.
