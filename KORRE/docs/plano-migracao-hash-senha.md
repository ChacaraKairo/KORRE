# Plano de migração de hash de senha

## Estado atual

O KORRE armazena senha em formato derivado com salt e comparação em tempo constante. O formato atual é `sha256i$iterations$salt$hash`, com compatibilidade para hashes legados SHA-256 simples.

## Objetivo

Migrar gradualmente para um formato mais forte sem invalidar usuários existentes:

```txt
pbkdf2-sha256$v1$iterations$salt$hash
```

## Estratégia segura

1. Manter o parser atual aceitando `sha256i` e hashes legados.
2. Adicionar um novo parser para `pbkdf2-sha256`.
3. Alterar `hashPassword` para gerar o novo formato.
4. Alterar `verifyPassword` para validar, nesta ordem:
   - `pbkdf2-sha256`
   - `sha256i`
   - SHA-256 legado
5. Depois de login bem-sucedido com formato antigo, regravar em segundo plano com o novo formato.
6. Não exportar senha em backup.
7. Criar testes para:
   - hash novo;
   - verificação de hash antigo;
   - rehash automático;
   - senha errada;
   - comparação sem curto-circuito.

## Parâmetros recomendados

- Algoritmo: PBKDF2-SHA256.
- Iterações iniciais: 120.000 ou mais, calibradas em aparelho Android real.
- Salt: 16 bytes aleatórios ou mais.
- Hash: 32 bytes.

## Observações

Argon2 ou Bcrypt seriam opções melhores quando houver biblioteca madura e estável para Expo/React Native no alvo de publicação. Para o beta, PBKDF2-SHA256 é o caminho de menor risco operacional.
