# 💰 SmartPocket - Gerenciador Financeiro Pessoal (PWA)

O **SmartPocket** é um Progressive Web App (PWA) leve e intuitivo, desenvolvido para facilitar o controle financeiro mensal. Ele permite registrar gastos, compras no cartão de crédito, investimentos e entradas, oferecendo um resumo detalhado do balanço mensal.

🚀 **Acesse o App:** [https://daniel-mscs.github.io/SmartPocket/](https://daniel-mscs.github.io/SmartPocket/)

---

## ✨ Funcionalidades

- 📅 **Controle Mensal:** Dados separados por mês com persistência automática.
- 💸 **Gestão de Gastos:** Registro de contas fixas e variáveis com data de pagamento.
- 💳 **Controle de Cartão:** Lançamentos específicos para crédito com data automática.
- 📈 **Investimentos:** Acompanhamento de aportes em Caixinhas, Bolsa ou Reserva.
- 💰 **Entradas:** Registro de salários, freelas e outras receitas.
- 📊 **Resumo Inteligente:** Cálculo automático de saldo e extrato detalhado por categoria.
- 📱 **Experiência PWA:** Instalável no celular (Android/iOS) e funciona offline.
- 🌙 **Dark Mode:** Interface moderna e confortável para uso noturno.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias web puras (Vanilla), focando em performance e simplicidade:

- **HTML5:** Estrutura semântica.
- **CSS3:** Estilização moderna com Variáveis CSS, Flexbox e Grid.
- **JavaScript (ES6+):** Lógica de negócio, manipulação de DOM e cálculos.
- **LocalStorage:** Persistência de dados local no navegador do usuário.
- **Service Workers & Web Manifest:** Transformação do site em um aplicativo instalável (PWA).
- **Font Awesome:** Ícones vetoriais.

---

## 📲 Como Instalar

Como o SmartPocket é um **PWA**, você não precisa baixar na App Store ou Play Store:

1. Acesse o link pelo navegador do seu celular.
2. No **Android (Chrome)**: Clique nos três pontinhos e selecione "Instalar aplicativo" ou "Adicionar à tela inicial".
3. No **iOS (Safari)**: Clique no botão de compartilhar (quadrado com seta) e selecione "Adicionar à Tela de Início".

---

## 📂 Estrutura do Projeto

```text
├── index.html      # Estrutura principal e abas
├── style.css       # Estilização (Dark Mode, Responsividade)
├── script.js      # Lógica, Cálculos e LocalStorage
├── sw.js           # Service Worker para funcionamento Offline
└── manifest.json   # Configurações de instalação do PWA