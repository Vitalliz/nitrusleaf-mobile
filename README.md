# NitrusLeaf — Monorepo do projeto

Sistema completo para monitoramento de citros: **app mobile** (React Native / Expo) + **API de IA** (Flask + TensorFlow) + **banco Supabase** (PostgreSQL).

Este repositório na raiz contém duas pastas principais. Leia este guia do zero se você acabou de clonar o projeto.

---

## Estrutura de diretórios

```text
nitrusleaf-mobile/          ← raiz do repositório Git
├── BeckAI/                 ← API Python da IA (classificação de folhas)
│   ├── Api.py              ← servidor Flask (porta 5000)
│   ├── requirements.txt    ← dependências Python
│   ├── folhas_mexerica_modelo.keras
│   └── .venv/              ← ambiente virtual (você cria localmente)
│
├── nitrusleaf-mobile/      ← aplicativo Expo / React Native
│   ├── app/                ← rotas (Expo Router, file-based)
│   │   ├── (tabs)/         ← abas: AI, History, Maps, Settings
│   │   ├── login.tsx, register.tsx, welcome.tsx
│   │   └── _layout.tsx     ← layout raiz + AuthProvider
│   ├── src/
│   │   ├── repositories/   ← acesso Supabase (usuarios, talhoes, pes, etc.)
│   │   ├── services/       ← Supabase, persistência de análise, avatar
│   │   ├── components/     ← UI, gráficos, cards
│   │   ├── contexts/       ← AuthContext
│   │   ├── utils/          ← navegação, validação, estatísticas de pés
│   │   └── utils/__tests__/← testes unitários (Jest)
│   ├── .env.example        ← modelo de variáveis de ambiente
│   ├── package.json
│   └── app.json            ← config Expo
│
├── .github/workflows/      ← CI (build, testes, lint)
└── README.md               ← este arquivo
```

| Pasta | Função |
|--------|--------|
| **BeckAI** | Recebe foto da folha, roda o modelo Keras e devolve classe + probabilidade (`POST /predict`). |
| **nitrusleaf-mobile** | App do produtor: cadastro, talhões, pés, scan com câmera, histórico e gráficos na home. |
| **.github** | Pipeline automático em push/PR (Node 22, `npm run validate`). |

---

## Pré-requisitos

Instale antes de começar:

| Ferramenta | Versão sugerida | Uso |
|------------|-----------------|-----|
| **Node.js** | 20 ou 22 LTS | App mobile e CI |
| **npm** | vem com Node | Dependências do Expo |
| **Python** | 3.10 ou 3.11 | API BeckAI |
| **Git** | qualquer recente | Clone do repositório |
| **Expo Go** ou emulador | — | Rodar o app no celular/emulador |
| **Conta Supabase** | — | Auth + PostgreSQL na nuvem |

Opcional: Android Studio (emulador Android), Xcode (simulador iOS, só macOS).

---

## 1. Configurar o Supabase (banco + login)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **Project Settings → API**, copie:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
3. No app mobile, copie o exemplo de ambiente:

```powershell
cd nitrusleaf-mobile
copy .env.example .env
```

Edite `nitrusleaf-mobile/.env` e preencha:

```env
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon
EXPO_PUBLIC_ENV=development
```

4. Garanta que as tabelas existem (`usuarios`, `propriedades`, `talhoes`, `pes`, `foto`, `relatorios`, …). O schema de referência está em `nitrusleaf-mobile/src/db/schema.sql`.

5. Em desenvolvimento, em **Authentication → Providers → Email**, você pode desativar “Confirm email” para testar cadastro mais rápido.

---

## 2. API de IA (BeckAI) — `.venv` no localhost

A IA **não** roda dentro do Expo. Você sobe o Flask na máquina e o celular/emulador chama `http://<IP-da-sua-PC>:5000/predict`.

### Primeira instalação

```powershell
cd BeckAI

# Criar ambiente virtual (Windows)
python -m venv .venv

# Ativar o venv
.\.venv\Scripts\Activate.ps1

# Instalar dependências (TensorFlow pode demorar)
pip install -r requirements.txt
```

O arquivo `folhas_mexerica_modelo.keras` precisa estar na pasta `BeckAI/`.

### Subir a API (sempre com venv ativo)

```powershell
cd BeckAI
.\.venv\Scripts\Activate.ps1
python Api.py
```

Saída esperada:

```text
API INICIADA
URL: http://localhost:5000
Endpoint predicao: POST /predict
```

Teste no navegador ou outro terminal:

```powershell
curl http://localhost:5000/health
```

### Classes retornadas pelo modelo atual

| Classe | Significado |
|--------|-------------|
| **Saudável** | Sem padrão forte de deficiência no modelo |
| **Manganês** | Indício de deficiência de manganês |

O app também está preparado para **Cobre** quando o modelo for estendido.

### Conectar o celular à API

- **Emulador Android:** o app usa `10.0.2.2:5000` em desenvolvimento.
- **Celular físico (Expo Go):** PC e celular na **mesma rede Wi‑Fi**. O app detecta o IP do Metro (`Constants.expoConfig.hostUri`) e chama `http://<IP>:5000/predict`.
- **Firewall Windows:** libere a porta **5000** para rede privada.

Mantenha **dois terminais** abertos durante o desenvolvimento:

1. `BeckAI` → `python Api.py` (venv ativo)
2. `nitrusleaf-mobile` → `npm run start` (Expo)

---

## 3. App mobile (nitrusleaf-mobile)

```powershell
cd nitrusleaf-mobile
npm install
npm run start
```

No terminal do Expo:

- `a` — Android  
- `i` — iOS  
- QR code — Expo Go no celular  

### Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `npm run start` | Servidor de desenvolvimento Expo |
| `npm run android` / `ios` / `web` | Abrir em plataforma específica |
| `npm run typecheck` | Verificação TypeScript |
| `npm run test` | Testes unitários (Jest) |
| `npm run lint` | ESLint |
| `npm run validate` | `typecheck` + `test` (igual ao CI) |

---

## 4. Fluxo completo (do zero ao scan)

1. **Subir Supabase** (nuvem) e configurar `.env` no app.
2. **Subir BeckAI** com venv: `python Api.py` em `BeckAI/`.
3. **Subir Expo:** `npm run start` em `nitrusleaf-mobile/`.
4. No app: **cadastrar conta** → **propriedade** → **talhão** → **pés (árvores)** no Histórico.
5. Aba **IA / Scan** → fotografar folha → resultado → **resumo técnico** → escolher talhão e pé → **Salvar**.
6. Os dados vão para `pes`, `foto`, `relatorios` e os gráficos da **Home** e do **Histórico** passam a refletir pés analisados.

### Contagem “X/Y árvores analisadas” no Histórico

- **Y** = quantidade de **pés** cadastrados naquele talhão.
- **X** = pés com análise (situação `Tratado` / `Não-Tratado` ou flags de deficiência após scan).

Se aparecer **0/0**, cadastre pelo menos um **pé** no talhão (Histórico → talhão → cadastrar pé). Só o talhão sem pés sempre mostrará 0/0.

---

## 5. Testes unitários

Os testes ficam em `nitrusleaf-mobile/src/utils/__tests__/`.

```powershell
cd nitrusleaf-mobile
npm run test
```

Arquivos atuais:

- `validation.test.ts` — e-mail, senha, nome, telefone
- `peStats.test.ts` — regras de “pé analisado” e totais por talhão

Para validar tudo como no CI:

```powershell
npm run validate
```

---

## 6. CI (GitHub Actions)

O workflow `.github/workflows/ci.yml` executa, na pasta `nitrusleaf-mobile/`:

- `npm ci`
- `npm run typecheck`
- `npm run test`
- `npm run lint:ci`

Não executa a API Python nem o Expo em nuvem — apenas qualidade do código TypeScript.

---

## 7. Variáveis de ambiente (resumo)

| Variável | Onde | Descrição |
|----------|------|-----------|
| `SUPABASE_URL` | `nitrusleaf-mobile/.env` | URL do projeto Supabase |
| `SUPABASE_ANON_KEY` | `nitrusleaf-mobile/.env` | Chave anon (pública no app) |
| `EXPO_PUBLIC_*` | `.env` | Flags opcionais (analytics, etc.) |

A URL da IA **não** vai no `.env`: o app monta `http://<host>:5000/predict` em tempo de execução (ver `app/(tabs)/AI/scan.tsx`).

---

## 8. Solução de problemas

| Problema | O que fazer |
|----------|-------------|
| Scan não conecta na IA | Confirme `python Api.py` com venv, mesma rede Wi‑Fi, firewall porta 5000 |
| `Modelo não carregado` | Verifique `folhas_mexerica_modelo.keras` em `BeckAI/` |
| Login/cadastro falha | Confirme `.env`, RLS e tabela `usuarios` no Supabase |
| Histórico 0/0 | Cadastre **pés** no talhão; após scan + salvar, contador sobe |
| Gráficos home vazios | Precisa de talhões, pés e pelo menos uma análise salva |
| Erro `pes_analisados` / schema cache | Rode `docs/supabase/add_talhao_count_columns.sql` no SQL Editor do Supabase (ou ignore: o app calcula pelos `pes`) |
| Troca de senha falha | Confirme senha atual; no Supabase, Auth deve permitir `updateUser` |

---

## 9. Documentação adicional

- Detalhes só do app: `nitrusleaf-mobile/README.md`
- Schema SQL de referência: `nitrusleaf-mobile/src/db/schema.sql`

---

## Licença

MIT — use e adapte conforme necessário.
