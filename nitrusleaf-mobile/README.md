# NitrusLeaf Mobile (Expo)

Aplicativo React Native com **Expo Router**, **Supabase** e integração com a API de IA em `../BeckAI`.

**Documentação completa do monorepo:** [README na raiz do repositório](../README.md)

## Início rápido

```bash
# 1. Variáveis de ambiente
cp .env.example .env
# Edite SUPABASE_URL e SUPABASE_ANON_KEY.
# Para usar a API local, deixe EXPO_PUBLIC_API_URL vazio.

# 2. Dependências
npm install

# 3. Em outro terminal: API de IA (na pasta BeckAI, com venv)
# cd ../BeckAI && .\.venv\Scripts\Activate.ps1 && python Api.py
# O celular e o computador devem estar na mesma rede Wi-Fi. Se necessário,
# configure EXPO_PUBLIC_API_URL=http://<IP-do-computador>:5000 no .env.

# 4. App
npm run start
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run start` | Expo dev server |
| `npm run test` | Jest (`backend/utils/__tests__/`) |
| `npm run typecheck` | TypeScript |
| `npm run validate` | typecheck + test |
| `npm run ci` | typecheck + test com cobertura + lint (igual ao job *quality* no GitHub Actions) |

## Estrutura interna

- `frontend/` — telas e rotas (Expo Router)
- `backend/repositories/` — Supabase
- `backend/services/` — análise, avatar, sync de talhão
- `backend/components/` — UI e gráficos
