================================================================
KORU COMPANY | GUIA DE COMANDOS EXPO & EAS
Projeto: MeuCorre
================================================================

---

1. COMANDOS DE BUILD (GERACAO DO APLICATIVO)

---

> GERAR APK (Para testes no celular e envio no WhatsApp)
> Comando: eas build -p android --profile preview
> O que faz: Gera o instalador (.apk) para Android e retorna um link/QR Code no terminal.

> GERAR BUNDLE OFICIAL (Para a Google Play Store)
> Comando: eas build -p android --profile production
> O que faz: Gera o pacote (.aab) oficial e criptografado exigido pelo Google.

> GERAR BUILD IOS (Teste no iPhone)
> Comando: eas build -p ios --profile preview
> O que faz: Gera a build de teste para simuladores Apple (Requer conta Apple Developer).

> GERAR BUILD IOS OFICIAL (Para a App Store)
> Comando: eas build -p ios --profile production
> O que faz: Gera o arquivo final (.ipa) para publicar na loja da Apple.

> GERAR PARA AMBAS AS LOJAS (Android + iOS)
> Comando: eas build -p all --profile production
> O que faz: Roda a build de producao para os dois sistemas ao mesmo tempo.

---

2. COMANDOS DE ENVIO (SUBMISSAO AUTOMATICA NAS LOJAS)

---

> ENVIAR PARA GOOGLE PLAY
> Comando: eas submit -p android --latest
> O que faz: Pega o ultimo .aab gerado e envia direto para o painel do Google Play Console.

> ENVIAR PARA APPLE APP STORE
> Comando: eas submit -p ios --latest
> O que faz: Pega o ultimo .ipa gerado e envia para o App Store Connect.

---

3. COMANDOS SALVA-VIDAS (MANUTENCAO E CONSULTAS)

---

> LIMPAR CACHE E REINICIAR (Solucao para telas brancas)
> Comando: npx expo start -c
> O que faz: Limpa o cache do Expo e inicia o servidor local do zero.

> LISTAR HISTORICO DE BUILDS
> Comando: eas build:list
> O que faz: Mostra uma lista no terminal com todas as builds ja feitas e o status (Sucesso/Erro).

> LOGIN NO EXPO
> Comando: eas login
> O que faz: Conecta o terminal a sua conta Expo (necessario ao trocar de PC).

> LOGOUT DO EXPO
> Comando: eas logout
> O que faz: Desconecta a conta do terminal.
