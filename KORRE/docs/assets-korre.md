# Assets do KORRE

Auditoria realizada para garantir que o app nao use imagens, logos, splash, favicon ou icones de outro projeto.

Busca executada:

Foi feita uma busca completa por nomes e arquivos associados a identidade visual externa.

Resultado: nenhuma referencia textual encontrada.

## Inventario

| Arquivo | Uso | Onde aparece | Tamanho atual | Fundo transparente |
|---|---|---|---|---|
| `assets/images/splash-logo.png` | Logo oficial do splash nativo e loading inicial customizado | `app.json`, `app/index.tsx` | 1024x1024 | Sim, RGBA |
| `assets/images/favicon.png` | Logo sem fundo para autenticacao e web favicon | `app.json`, `app/(auth)/login.tsx`, `app/(auth)/recuperar-senha.tsx`, `components/telas/Cadastro/HeaderCadastro.tsx` | 500x500 | Sim, RGBA |
| `assets/images/icon.png` | Icone principal do app | `app.json` | 1024x1024 | Nao, RGB |
| `assets/images/android-icon-background.png` | Fundo do adaptive icon Android | `app.json` | 1024x1024 | Nao, RGB |
| `assets/images/android-icon-foreground-safe.png` | Foreground do adaptive icon Android com area segura | `app.json` | 1024x1024 | Sim, RGBA |
| `assets/images/android-icon-foreground.png` | Foreground alternativo do adaptive icon Android | Reserva | 1024x1024 | Sim, RGBA |
| `assets/images/android-icon-monochrome-safe.png` | Icone monocromatico Android com area segura | `app.json` | 1024x1024 | Sim, RGBA |
| `assets/images/android-icon-monochrome.png` | Icone monocromatico alternativo | Reserva e alguns relatorios legados | 1024x1024 | Sim, RGBA |
| `assets/images/splash-icon.png` | Arte de splash legada | Reserva | 1243x2436 | Nao, RGB |
| `assets/images/koru.png` | Logo institucional Koru/empresa | Tela de suporte | 1024x1024 | Nao, RGB |

## Regras de uso

- Splash nativo: usar `splash-logo.png`.
- Loading inicial customizado: usar `splash-logo.png`.
- Login, cadastro e recuperacao de senha: usar `favicon.png` quando a logo precisa aparecer sem fundo e animada/centralizada.
- Icone principal do app: usar `icon.png`.
- Adaptive icon Android: usar os arquivos `android-icon-*` configurados em `app.json`.
- Nao adicionar assets com nomes ou identidade de outro projeto.

## Configuracao atual do splash

```json
{
  "image": "./assets/images/splash-logo.png",
  "imageWidth": 280,
  "resizeMode": "contain",
  "backgroundColor": "#000000"
}
```
