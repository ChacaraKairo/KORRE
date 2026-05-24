# 04. Rotas e Navegação

## Modelo
Expo Router com grupos `(auth)` e `(tabs)` e rotas auxiliares.

## Tabela de rotas
| Rota | Tela | Pública/Privada | Descrição | Observações |
|---|---|---|---|---|
| `/` | index | Pública | entrada/splash de fluxo | redireciona conforme estado |
| `/(auth)/login` | login | Pública | autenticação local | |
| `/(auth)/cadastro` | cadastro | Pública | criação de conta local | |
| `/(auth)/recuperar-senha` | recuperar senha | Pública | recuperação local | |
| `/(auth)/termos` | termos | Pública | termos de uso | |
| `/(auth)/politica-privacidade` | política | Pública | privacidade | |
| `/(tabs)/dashboard` | dashboard | Privada | visão operacional | |
| `/(tabs)/garagem` | garagem | Privada | veículos e km | |
| `/(tabs)/oficina` | oficina | Privada | manutenção planejada/real | |
| `/(tabs)/finance` | financeiro | Privada | ganhos/despesas | |
| `/(tabs)/calculadora` | calculadora flex | Pública/Privada | cálculo e abastecimento | uso sem login permitido |
| `/(tabs)/calculadora_korre` | auditoria KORRE | Privada | índices e custos | |
| `/(tabs)/analisar_corrida` | análise corrida | Privada | viabilidade manual | |
| `/notificacoes` | notificações | Privada | histórico de alertas | |
| `/relatorios/*` | relatórios | Privada | relatórios financeiros | |
| `/(tabs)/suporte` | suporte | Pública/Privada | canais oficiais | |

## Navegação segura
- Uso de retorno (`returnRoute`) em fluxos específicos.
- `safeBack` aplicado para fallback de navegação.
- Suporte ao botão físico Android no fluxo de navegação padrão.

## Implementado atualmente
- Rotas listadas acima em `app/`.

## Planejado
- Expansão de fluxo remoto baseado em notificações push.

## Pendente
- Matriz formal de ACL por rota.

## Riscos e cuidados
- Evitar deep links para telas privadas sem autenticação.
