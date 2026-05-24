# 20. Painel Electron

## Objetivo
Disponibilizar operação administrativa em desktop usando o mesmo front web.

## Diretrizes de segurança
- `contextIsolation: true`
- `nodeIntegration: false`
- preload restrito

## Implementado atualmente
- Casca inicial em projeto de plataforma separado.

## Planejado
- Build desktop assinável.
- Configuração de endpoint API por ambiente.

## Riscos e cuidados
- Evitar expor APIs nativas sem controle no renderer.
