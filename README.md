# 📱 NitrusLeaf Mobile

Aplicativo mobile desenvolvido com **React Native** e **Expo**, utilizando **Expo Router** para navegação e componentes modernos de interface.  
O projeto foi criado para oferecer uma experiência fluida, responsiva e com suporte multiplataforma (Android, iOS e Web).

---

## 🚀 Tecnologias Principais

- [Expo](https://expo.dev/) — Framework para desenvolvimento React Native
- [React Navigation](https://reactnavigation.org/) — Sistema de navegação entre telas
- [Expo Router](https://expo.github.io/router/docs) — Roteamento baseado em arquivos
- [TypeScript](https://www.typescriptlang.org/) — Tipagem estática opcional
- [Expo Vector Icons](https://docs.expo.dev/guides/icons/) — Ícones customizáveis
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) — Efeitos de gradiente
- [Expo Splash Screen](https://docs.expo.dev/versions/latest/sdk/splash-screen/) — Tela de carregamento inicial

---

## 📂 Estrutura do Projeto

```text
nitrusleaf-mobile/
├── app/                 
│   ├── (tabs)/          # Navegação com abas (Home, Login, Registro, etc.)
│   ├── _layout.tsx      # Layout global de navegação
│   └── modal.tsx        # Modal de exemplo
├── assets/              # Imagens e ícones
├── components/          # (Se existir) Componentes reutilizáveis
├── App.js               # Ponto de entrada principal
├── package.json         # Configurações do projeto e dependências
└── tsconfig.json        # Configuração do TypeScript


## 🧭 Funcionalidades Principais

- Tela de **Login** e **Cadastro**
- Interface com **abas de navegação**
- **Splash screen** personalizada
- Estrutura modular e escalável
- Integração com recursos nativos via Expo

---

## 🛠️ Como Executar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/nitrusleaf-mobile.git
cd nitrusleaf-mobile 

### 2. Instalar dependências
npm install
# ou
yarn install

3. Iniciar o aplicativo
npm start
# ou
yarn start
🧰 Scripts Disponíveis
ComandoDescriçãonpm startInicia o servidor de desenvolvimentonpm run androidExecuta o app em um emulador Androidnpm run iosExecuta o app em um simulador iOSnpm run webRoda o projeto no navegadornpm run lintVerifica o código com ESLintnpm run reset-projectReseta o cache e reinstala dependências

🧑‍💻 Desenvolvimento
O projeto segue uma estrutura limpa e modular, facilitando a expansão de novas telas e funcionalidades.
Os arquivos dentro da pasta app/(tabs) representam cada aba da aplicação, como home.tsx, login.tsx e register.tsx.

📸 Assets e Ícones
Os ícones e imagens estão armazenados em:
assets/images/icons/

Podem ser utilizados através do Image do React Native ou do expo-image.

📄 Licença
Este projeto é distribuído sob a licença MIT.
Sinta-se livre para usar e modificar conforme necessário.

Desenvolvido com ❤️ usando React Native + Expo

---


