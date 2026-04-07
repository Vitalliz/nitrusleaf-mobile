# NitrusLeaf Mobile 📱🌿

Uma aplicação móvel React Native/Expo para gestão agrícola de propriedades, talhões e pés de frutas. Desenvolvida para facilitar o monitoramento e análise de plantações, com foco em deficiências nutricionais e saúde das plantas.

## 🚀 Funcionalidades

### Gestão de Propriedades
- Cadastro completo de propriedades com endereço
- Visualização de talhões associados
- Edição e exclusão de propriedades

### Gestão de Talhões
- Criação de talhões dentro de propriedades
- Definição de espécie de fruta cultivada
- Organização espacial dos pés

### Gestão de Pés
- Cadastro detalhado de cada pé de fruta
- Identificação por linha e coluna
- Rastreamento de situação (Saudável/Doente/Morto)
- Registro de deficiências nutricionais múltiplas
- Data de plantio e coordenadas GPS
- Galeria de fotos para monitoramento

### Análise e Relatórios
- Análise de deficiências por talhão
- Relatórios de saúde das plantações
- Visualização de mapas NDVI e satélite

### Perfil e Autenticação
- Sistema de login e registro
- Perfil do usuário com dados pessoais
- Configurações de conta

## 🛠️ Tecnologias Utilizadas

- **React Native** com **Expo** - Framework para desenvolvimento mobile
- **Expo Router** - Navegação baseada em arquivos
- **Expo SQLite** - Banco de dados local
- **TypeScript** - Tipagem estática
- **Expo Camera** - Captura de fotos
- **Ionicons** - Ícones da interface
- **React Native Safe Area Context** - Adaptação a diferentes telas

## 📁 Estrutura do Projeto

```
nitrusleaf-mobile/
├── app/                          # Páginas da aplicação (Expo Router)
│   ├── (tabs)/                   # Abas principais
│   │   ├── add-foot.tsx         # Cadastro de pés
│   │   ├── add-property.tsx     # Cadastro de propriedades
│   │   ├── add-talhao.tsx       # Cadastro de talhões
│   │   ├── field-feet.tsx       # Lista de pés por talhão
│   │   ├── fields.tsx           # Lista de talhões por propriedade
│   │   ├── pe-details.tsx       # Detalhes de um pé
│   │   ├── property-details.tsx # Detalhes de uma propriedade
│   │   ├── profile.tsx          # Perfil do usuário
│   │   └── ...
│   ├── login.tsx                # Tela de login
│   ├── register.tsx             # Tela de registro
│   └── _layout.tsx              # Layout raiz
├── src/                         # Código fonte
│   ├── components/              # Componentes reutilizáveis
│   │   ├── ui/                  # Componentes de UI
│   │   └── ...
│   ├── constants/               # Constantes da aplicação
│   ├── contexts/                # Contextos React
│   ├── database/                # Configuração do banco
│   ├── hooks/                   # Hooks customizados
│   ├── repositories/            # Camada de acesso a dados
│   │   ├── authRepository.ts    # Repositório de autenticação
│   │   ├── peRepository.ts      # Repositório de pés
│   │   ├── propertyRepository.ts# Repositório de propriedades
│   │   └── talhaoRepository.ts  # Repositório de talhões
│   ├── services/                # Serviços externos
│   ├── types/                   # Definições TypeScript
│   │   ├── auth.ts              # Tipos de autenticação
│   │   ├── common.ts            # Tipos comuns
│   │   ├── pe.ts                # Tipos de pés
│   │   ├── property.ts          # Tipos de propriedades
│   │   └── talhao.ts            # Tipos de talhões
│   └── utils/                   # Utilitários
├── db/                          # Scripts SQL
│   └── schema.sql               # Schema do banco de dados
└── package.json                 # Dependências
```

## 🗄️ Banco de Dados

O aplicativo utiliza SQLite local com as seguintes tabelas principais:

- **propriedades** - Informações das propriedades rurais
- **talhoes** - Divisões dentro das propriedades
- **pes** - Árvores/pés individuais com localização e saúde
- **fotos** - Galeria de imagens para monitoramento

### Schema SQL
```sql
-- Ver db/schema.sql para o schema completo
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Vitalliz/nitrusleaf-mobile.git
cd nitrusleaf-mobile
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npx expo start
```

4. Escolha uma das opções:
   - **Expo Go**: Instale o app Expo Go no seu dispositivo e escaneie o QR code
   - **Emulador Android/iOS**: Configure um emulador e selecione a opção correspondente
   - **Web**: Abra no navegador (limitado)

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run android` - Executa no emulador Android
- `npm run ios` - Executa no simulador iOS
- `npm run web` - Executa no navegador
- `npm run lint` - Executa o linter

## 🔒 Segurança

- Validação rigorosa de entrada de dados
- Sanitização de parâmetros SQL
- Controle de tipos TypeScript
- Tratamento adequado de erros
- Validação de coordenadas GPS
- Verificação de formatos de data

## 📱 Funcionalidades Planejadas

- [ ] Sincronização com servidor remoto
- [ ] Análise de imagens com IA para detecção de doenças
- [ ] Relatórios avançados em PDF
- [ ] Integração com mapas offline
- [ ] Notificações push para alertas de saúde das plantas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Equipe NitrusLeaf** - Desenvolvimento inicial

## 🙏 Agradecimentos

- Expo Team pela excelente plataforma
- Comunidade React Native
- Agricultores e especialistas que forneceram conhecimento do domínio
