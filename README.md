# NitrusLeaf Mobile

Aplicativo mobile desenvolvido com React Native e Expo, utilizando Expo Router para navegação e componentes modernos de interface.
O projeto foi criado para oferecer uma experiência fluida, responsiva e com suporte multiplataforma (Android, iOS e Web).


## Tecnologias Principais

* Expo — Framework para desenvolvimento React Native
* React Navigation — Sistema de navegação entre telas
* Expo Router — Roteamento baseado em arquivos
* TypeScript — Tipagem estática opcional
* Expo Vector Icons — Ícones customizáveis
* Expo Linear Gradient — Efeitos de gradiente
* Expo Splash Screen — Tela de carregamento inicial

## Estrutura do Projeto

```text
nitrusleaf-mobile/
├── app/                 
│   ├── (tabs)/          # Navegação com abas (Home, Login, Registro, etc.)
│   ├── _layout.tsx      # Layout global de navegação
│   └── modal.tsx        # Modal de exemplo
├── assets/              # Imagens e ícones
├── components/          # Componentes reutilizáveis (opcional)
├── App.js               # Ponto de entrada principal
├── package.json         # Configurações do projeto e dependências
└── tsconfig.json        # Configuração do TypeScript
```



## Funcionalidades Principais

* Tela de Login e Cadastro
* Interface com abas de navegação
* Splash screen personalizada
* Estrutura modular e escalável
* Integração com recursos nativos via Expo



## Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/nitrusleaf-mobile.git
cd nitrusleaf-mobile
```

### 2. Instalar dependências

```bash
npm install
# ou
yarn install
```

### 3. Iniciar o aplicativo

```bash
npx expo start
# ou
npm start
# ou
yarn start
```

---

## Scripts Disponíveis

| Comando               | Descrição                               |
| --------------------- | --------------------------------------- |
| npm start             | Inicia o servidor de desenvolvimento    |
| npx expo start        | Inicia o Expo diretamente               |
| npm run android       | Executa o app em um emulador Android    |
| npm run ios           | Executa o app em um simulador iOS       |
| npm run web           | Roda o projeto no navegador             |
| npm run lint          | Verifica o código com ESLint            |
| npm run reset-project | Reseta o cache e reinstala dependências |


## Assets e Ícones

Os ícones e imagens estão armazenados em:

```
assets/images/icons/
```

Podem ser utilizados através do componente Image do React Native ou do expo-image.


## Licença

Este projeto é distribuído sob a licença MIT.
Sinta-se livre para usar e modificar conforme necessário.
