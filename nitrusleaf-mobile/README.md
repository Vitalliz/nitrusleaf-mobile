# NitrusLeaf Mobile (Expo)

Aplicativo React Native com **Expo Router**, **Supabase** e integração com a API de IA em `../BeckAI`.

**Documentação completa do monorepo (instalação do zero, BeckAI com `.venv`, testes, diretórios):**  
→ [README na raiz do repositório](../README.md)

## Início rápido

```bash
# 1. Variáveis de ambiente
cp .env.example .env
# Edite SUPABASE_URL e SUPABASE_ANON_KEY

# 2. Dependências
npm install

# 3. Em outro terminal: API de IA (na pasta BeckAI, com venv)
# cd ../BeckAI && .\.venv\Scripts\Activate.ps1 && python Api.py

# 4. App
npm run start
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run start` | Expo dev server |
| `npm run test` | Jest (`src/utils/__tests__/`) |
| `npm run typecheck` | TypeScript |
| `npm run validate` | typecheck + test (CI) |

## Estrutura interna

- `app/` — telas e rotas
- `src/repositories/` — Supabase
- `src/services/` — análise, avatar, sync de talhão
- `src/components/` — UI e gráficos
