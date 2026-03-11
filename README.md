🏍️ Meu-Corre (Central do Motoboy)

O Meu-Corre é um ecossistema digital concebido para ser o "escritório de bolso" dos profissionais de entrega e transporte em duas rodas. O projeto foca-se na produtividade, economia e segurança, permitindo ao motoboy gerir as suas finanças, prever manutenções e aceder a um marketplace especializado.

🚀 Como Testar o Projeto

Este repositório contém um protótipo funcional desenvolvido com React Native e Expo. Siga os passos abaixo para executar o projeto no seu dispositivo ou emulador.

1. Pré-requisitos

Antes de começar, certifique-se de que tem instalado:

Node.js (versão 18 ou superior)

npm ou yarn

Expo Go (aplicação disponível na Play Store ou App Store no seu telemóvel)

2. Instalação

Clone o repositório e aceda à pasta do protótipo:

# Clonar o repositório
git clone [https://github.com/ChacaraKairo/Meu-Corre.git](https://github.com/ChacaraKairo/Meu-Corre.git)

# Aceder à pasta do projeto
cd Meu-Corre/Prototipo/MeuCorre


3. Instalar Dependências

Execute o comando para instalar todas as bibliotecas necessárias:

npm install
# ou
yarn install


4. Execução

Inicie o servidor de desenvolvimento do Expo:

npx expo start


5. Visualização

No Telemóvel (Recomendado): Abra a aplicação Expo Go, clique em "Scan QR Code" e aponte para o código que apareceu no seu terminal.

No Android/iOS Emulator: Pressione a para Android ou i para iOS no terminal (requer Android Studio ou Xcode configurado).

No Navegador: Pressione w para abrir a versão web (algumas funcionalidades nativas como SQLite podem ter comportamento limitado no browser).

📋 Funcionalidades Principais

💰 Gestão Financeira (O "Corre" Diário)

Diário de Bordo: Registo de KM Inicial e Final para cálculo automático de rodagem.

Fluxo de Caixa: Lançamento rápido de ganhos por plataforma (iFood, Uber, etc.) e despesas (combustível, alimentação).

Lucro Real: Cálculo instantâneo do que sobra no bolso após descontar os custos operacionais.

🔧 Manutenção Preventiva

Alertas por KM: O sistema utiliza a rodagem acumulada para sugerir trocas de óleo, pneus e revisões, evitando quebras inesperadas.

🛒 Marketplace & Proteção (Em desenvolvimento)

Loja Curada: Peças e acessórios com foco em custo-benefício.

Seguros: Planos de proteção contra roubo, furto e assistência 24h.

🛠️ Stack Técnica (Foco em Performance)

Para garantir que o app rode de forma fluida em aparelhos de entrada (com pouca RAM), escolhemos as tecnologias mais leves do mercado:

Framework: React Native + Expo.

Estilização: NativeWind (Tailwind CSS) - Estilos estáticos que não sobrecarregam a CPU.

Estado: Zustand - Gestão de dados ultraleve (superior ao Redux em performance).

Banco de Dados: SQLite - Armazenamento local rápido e resiliente (funciona offline).

Listas: FlashList (Shopify) - Renderização de alto desempenho para históricos longos.

Ícones: Lucide React Native (Vetorizados em SVG).

🏗️ Estrutura de Pastas

Meu-Corre/
├── Documentação/        # Planos de visão, guias UX e especificações
├── Prototipo/           # Código fonte do aplicativo
│   └── MeuCorre/
│       ├── src/
│       │   ├── components/  # Componentes reutilizáveis (Botões, Inputs)
│       │   ├── screens/     # Telas do App (Dashboard, Login, Cadastro)
│       │   ├── database/    # Configuração do SQLite
│       │   └── styles/      # Definições visuais
│       └── App.tsx          # Ponto de entrada
└── README.md            # Este ficheiro


📈 Roadmap do Projeto

[x] Fase 1 (MVP): Gestão financeira offline, KM e histórico local.

[ ] Fase 2: Dashboards gráficos de performance e exportação de relatórios em PDF.

[ ] Fase 3: Integração com APIs de pagamento para o Marketplace e Seguros.

Autor: ChacaraKairo

Projeto focado em dignidade e eficiência para quem faz a economia girar sobre duas rodas.
