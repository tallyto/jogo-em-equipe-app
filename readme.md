# Casais App - Aplicativo Mobile para Desafios e Recompensas em Relacionamentos

[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Navigation](https://img.shields.io/badge/React_Navigation-5860F2?style=for-the-badge&logoColor=white)](https://reactnavigation.org/)
[![React Native Paper](https://img.shields.io/badge/React_Native_Paper-3F51B5?style=for-the-badge&logo=android&logoColor=white)](https://reactnativepaper.com/)
[![Expo](https://img.shields.io/badge/Expo-4630EB?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/en/)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![yarn](https://img.shields.io/badge/yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)](https://yarnpkg.com/)

## Visão Geral

O Casais App é um aplicativo mobile desenvolvido para casais que desejam fortalecer seu relacionamento através de desafios divertidos e um sistema de recompensas mútuas. O aplicativo permite que os usuários criem desafios, atribuam pontos a eles e criem recompensas que podem ser trocadas pelos pontos acumulados.

## Funcionalidades Principais

* **Autenticação:**
    * Registro de novos usuários com e-mail e senha.
    * Login de usuários existentes.
    * Sistema de autenticação seguro utilizando tokens.
* **Desafios:**
    * Listagem de desafios ativos no dashboard da tela inicial.
    * Criação de novos desafios com nome e descrição.
    * Visualização dos detalhes de um desafio específico.
    * Listagem de tarefas associadas a um desafio.
    * Criação de novas tarefas dentro de um desafio, com descrição e pontos.
* **Recompensas:**
    * (Funcionalidade em desenvolvimento - interface criada) Criação de recompensas com custo em pontos e nome.
    * (Funcionalidade não implementada) Listagem e resgate de recompensas.
* **Navegação:**
    * Utilização de `React Navigation` para uma experiência de navegação fluida entre as telas.
* **Gerenciamento de Estado:**
    * Utilização do `Context API` para gerenciar o estado de autenticação do usuário.
* **Persistência:**
    * Utilização do `Expo SecureStore` para armazenar o token de autenticação de forma segura no dispositivo.
* **Comunicação com a API:**
    * Realização de requisições HTTP para um backend (API Spring Boot) para buscar e persistir dados.

## Tecnologias Utilizadas

* [![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactnative.dev/)
* [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
* [![React Navigation](https://img.shields.io/badge/React_Navigation-5860F2?style=flat-square&logoColor=white)](https://reactnavigation.org/)
* [![React Native Paper](https://img.shields.io/badge/React_Native_Paper-3F51B5?style=flat-square&logo=android&logoColor=white)](https://reactnativepaper.com/)
* [![Expo](https://img.shields.io/badge/Expo-4630EB?style=flat-square&logo=expo&logoColor=white)](https://expo.dev/)
* [![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/en/)
* [![npm](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com/)
* [![yarn](https://img.shields.io/badge/yarn-2C8EBB?style=flat-square&logo=yarn&logoColor=white)](https://yarnpkg.com/)

## Pré-requisitos

* **Node.js e npm (ou yarn):** Necessários para executar o projeto e instalar dependências.
    * Recomenda-se uma versão LTS do Node.js.
* **Expo CLI:** Ferramenta de linha de comando do Expo. Pode ser instalada globalmente com `npm install -g expo-cli` ou `yarn global add expo-cli`.
* **Emulador/Simulador ou dispositivo físico:** Para executar o aplicativo. Você pode usar o emulador do Android Studio, o simulador do Xcode ou um dispositivo físico com o aplicativo Expo Go instalado.
* **Backend da API:** Este aplicativo mobile depende de um backend rodando (atualmente em `http://10.0.2.2:3002`). Certifique-se de que o backend esteja configurado e em execução.

## Como Executar o Aplicativo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/tallyto/jogo-em-equipe-app](https://github.com/tallyto/jogo-em-equipe-app)
    cd jogo-em-equipe-app
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Inicie o aplicativo com Expo CLI:**
    ```bash
    npx expo start
    # ou
    yarn start
    ```

4.  **Execute no seu dispositivo/emulador:**
    * **Emulador/Simulador:** Se você tiver um emulador Android ou simulador iOS configurado e rodando, o Expo CLI deve detectar automaticamente e tentar abrir o aplicativo nele.
    * **Dispositivo Físico:**
        * Baixe e instale o aplicativo **Expo Go** na App Store (iOS) ou Google Play Store (Android).
        * Escaneie o código QR que aparece no terminal ou na interface web do Expo CLI com o aplicativo Expo Go.

## Próximos Passos e Melhorias

* Implementar completamente a funcionalidade de recompensas (criação, listagem, resgate).
* Adicionar a funcionalidade de marcar tarefas como concluídas e atualizar os pontos do usuário.
* Implementar notificações (por exemplo, quando um novo desafio é criado ou uma tarefa é concluída).
* Melhorar o design e a experiência do usuário em todas as telas.
* Adicionar testes unitários e de integração.
* Implementar internacionalização (i18n).
* Explorar a possibilidade de adicionar funcionalidades sociais (compartilhamento de desafios, etc.).

## Contribuição

Contribuições são bem-vindas! Se você encontrar algum problema ou tiver sugestões de melhorias, por favor, abra uma issue ou envie um pull request no repositório.

## Licença

[MIT License]