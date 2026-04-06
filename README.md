# 🏍️ MeuCorre - App Mobile

![Expo](https://img.shields.io/badge/Expo-1C1E24?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Status](https://img.shields.io/badge/Status-Vers%C3%A3o_1.0.1-success?style=for-the-badge)

> **O painel de controlo definitivo para a operação de motoristas e motoboys. Calcule lucros, controle despesas e faça a gestão da manutenção do veículo diretamente do smartphone.**

---

## 🎯 Sobre o Projeto

O **MeuCorre** é uma ferramenta de gestão financeira e de frota focada em profissionais de transporte (apps de entrega e passageiros). Desenhado para resolver a dor de "pagar para trabalhar", o app substitui blocos de notas confusos por cálculos automatizados.

**Mudança Arquitetural Recente:** O aplicativo adotou o modelo _Premium Direct_ (pagamento único via Google Play Store). Isso eliminou a necessidade de barreiras de autenticação complexas (sistemas de token de terceiros), permitindo que o utilizador aceda às ferramentas imediatamente após a instalação.

## ✨ Funcionalidades Principais

- 🧮 **Calculadora IKM (Índice por KM):** O motor de cálculo em tempo real. O utilizador digita o valor, distância e tempo da corrida solicitada, e o app devolve imediatamente a margem de lucro (Verde) ou prejuízo (Vermelho).
- 🔧 **Garagem Digital:** Registo completo da manutenção preventiva e corretiva (óleo, pneus, kit relação), com base na quilometragem rodada.
- 📊 **Balanço Financeiro (DRE):** Visão geral do fluxo de caixa. Subtrai automaticamente as despesas (combustível, alimentação, manutenção) dos ganhos diários/semanais.
- 📴 **Arquitetura Offline-First:** Toda a base de dados funciona localmente, garantindo zero latência e uso completo do app mesmo em áreas sem sinal de internet.

## 🛠️ Stack Tecnológico

- **Framework:** [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/) (SDK +48)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Navegação:** Expo Router (File-based routing)
- **Base de Dados Local:** SQLite (`expo-sqlite`)
- **Build System:** EAS (Expo Application Services) para binários Android (`.apk` e `.aab`)

## ⚙️ Estrutura do Projeto

````text
MeuCorre/
├── app/                  # Rotas da aplicação (Expo Router)
│   ├── (tabs)/           # Ecrãs principais (Dashboard, Calculadora, Oficina)
│   └── _layout.tsx       # Layout raiz da navegação
├── assets/               # Imagens, splash screen e ícones adaptativos (512x512)
├── components/           # Componentes UI reutilizáveis
├── eas.json              # Perfis de build para APK (preview) e Play Store (production)
├── app.json              # Configurações do manifesto Android (VersionCode, Package)
└── package.json          # Dependências do projeto# 🏍️ MeuCorre - App Mobile

![Expo](https://img.shields.io/badge/Expo-1C1E24?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Status](https://img.shields.io/badge/Status-Vers%C3%A3o_1.0.1-success?style=for-the-badge)

> **O painel de controlo definitivo para a operação de motoristas e motoboys. Calcule lucros, controle despesas e faça a gestão da manutenção do veículo diretamente do smartphone.**

---

## 🎯 Sobre o Projeto

O **MeuCorre** é uma ferramenta de gestão financeira e de frota focada em profissionais de transporte (apps de entrega e passageiros). Desenhado para resolver a dor de "pagar para trabalhar", o app substitui blocos de notas confusos por cálculos automatizados.

**Mudança Arquitetural Recente:** O aplicativo adotou o modelo *Premium Direct* (pagamento único via Google Play Store). Isso eliminou a necessidade de barreiras de autenticação complexas (sistemas de token de terceiros), permitindo que o utilizador aceda às ferramentas imediatamente após a instalação.

## ✨ Funcionalidades Principais

* 🧮 **Calculadora IKM (Índice por KM):** O motor de cálculo em tempo real. O utilizador digita o valor, distância e tempo da corrida solicitada, e o app devolve imediatamente a margem de lucro (Verde) ou prejuízo (Vermelho).
* 🔧 **Garagem Digital:** Registo completo da manutenção preventiva e corretiva (óleo, pneus, kit relação), com base na quilometragem rodada.
* 📊 **Balanço Financeiro (DRE):** Visão geral do fluxo de caixa. Subtrai automaticamente as despesas (combustível, alimentação, manutenção) dos ganhos diários/semanais.
* 📴 **Arquitetura Offline-First:** Toda a base de dados funciona localmente, garantindo zero latência e uso completo do app mesmo em áreas sem sinal de internet.

## 🛠️ Stack Tecnológico

* **Framework:** [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/) (SDK +48)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Navegação:** Expo Router (File-based routing)
* **Base de Dados Local:** SQLite (`expo-sqlite`)
* **Build System:** EAS (Expo Application Services) para binários Android (`.apk` e `.aab`)

## ⚙️ Estrutura do Projeto

```text
MeuCorre/
├── app/                  # Rotas da aplicação (Expo Router)
│   ├── (tabs)/           # Ecrãs principais (Dashboard, Calculadora, Oficina)
│   └── _layout.tsx       # Layout raiz da navegação
├── assets/               # Imagens, splash screen e ícones adaptativos (512x512)
├── components/           # Componentes UI reutilizáveis
├── eas.json              # Perfis de build para APK (preview) e Play Store (production)
├── app.json              # Configurações do manifesto Android (VersionCode, Package)
└── package.json          # Dependências do projeto
````
