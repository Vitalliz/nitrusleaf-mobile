# Estrutura do código (src)

Todo o código da aplicação está organizado aqui. O alias `@/` no projeto aponta para esta pasta.

## Pastas

| Pasta | Conteúdo |
|-------|----------|
| **assets** | Imagens, ícones e recursos estáticos |
| **components** | Componentes reutilizáveis (footer, header, card, etc.) e `ui/` para primitivos |
| **constants** | Configurações e tema (theme, config) |
| **contexts** | Contextos React (AuthContext) |
| **db** | `schema.sql` – schema do banco (MySQL/MariaDB) para referência e próximos passos |
| **hooks** | Hooks customizados (use-color-scheme, use-theme-color) |
| **models** | Modelos de dados (analysis, etc.) |
| **repositories** | Acesso a dados (analysisRepository, userRepository) |
| **services** | API e integrações |
| **types** | Tipos TypeScript (auth, common) |
| **utils** | Funções utilitárias (validation, etc.) |
| **viewmodels** | Lógica de apresentação (analysisViewModel, registerViewModel, etc.) |

## Uso do schema.sql

O arquivo `db/schema.sql` contém o dump do banco **nitrusleaf_pi** (MySQL/MariaDB). Use-o como referência para:

- Criar/migrar tabelas no SQLite local
- Alinhar modelos e repositórios com o backend
- Próximas integrações e migrações

## Imports

Use o alias `@/` para importar a partir de `src/`:

```ts
import Footer from '@/components/footer';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import type { User } from '@/types/auth';
```
