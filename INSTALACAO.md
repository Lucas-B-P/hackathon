# Instalação — Patinhas Pet Shop

Guia para clonar e rodar o projeto em um computador novo. O sistema usa **dois repositórios**: front-end e API.

| Repositório | URL |
|-------------|-----|
| Front-end | https://github.com/Lucas-B-P/hackathon |
| API | https://github.com/Lucas-B-P/hackathon-api |

---

## Pré-requisitos

Instale antes de começar:

- **Node.js 22+** ([nodejs.org](https://nodejs.org/) ou [mise](https://mise.jdx.dev/))
- **Git** + **Git LFS** (imagens do front usam LFS)
- **PostgreSQL 17** (ou versão compatível)

---

## 1. Clonar os repositórios

```bash
git clone https://github.com/Lucas-B-P/hackathon.git
git clone https://github.com/Lucas-B-P/hackathon-api.git
```

No front-end, baixe os arquivos de imagem (Git LFS):

```bash
cd hackathon
git lfs install
git lfs pull
```

---

## 2. Banco de dados (PostgreSQL)

Crie o banco de dados:

```sql
CREATE DATABASE patinhas;
```

Credenciais usadas neste guia (ajuste no `.env` se forem diferentes):

- **Usuário:** `postgres`
- **Senha:** `postgres`
- **Banco:** `patinhas`
- **Host:** `localhost`
- **Porta:** `5432`

---

## 3. Configurar a API (`hackathon-api`)

```bash
cd hackathon-api
npm install
cp .env.example .env
```

Edite o arquivo `.env`:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/patinhas
WEB_ORIGIN=http://localhost:8443,http://localhost:5173
JWT_SECRET=uma-chave-secreta-forte-aqui
SENSITIVE_DATA_KEY=mesma-chave-base64-nos-dois-projetos
```

### Gerar chaves

**JWT_SECRET** — qualquer string longa e aleatória (ex.: UUID ou frase longa).

**SENSITIVE_DATA_KEY** — chave AES de 32 bytes em base64 (obrigatória para CPF, telefone e nascimento):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

> **Importante:** use o **mesmo valor** em `SENSITIVE_DATA_KEY` (API) e `VITE_SENSITIVE_DATA_KEY` (front).

### Migrations e servidor

```bash
npm run db:migrate
npm run dev
```

A API ficará disponível em **http://localhost:3000**.

Teste: http://localhost:3000/health — deve retornar `"status":"ok"` e `"database":"ok"`.

---

## 4. Configurar o front-end (`hackathon`)

Em outro terminal:

```bash
cd hackathon
npm install
cp .env.example .env
```

Edite o `.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_SENSITIVE_DATA_KEY=mesma-chave-da-api
```

Suba o servidor de desenvolvimento:

```bash
npm run dev
```

O front ficará em **http://localhost:8443**.

---

## 5. Validar o fluxo

1. Acesse http://localhost:8443/cadastro
2. Crie uma conta (nome, CPF, telefone, nascimento, e-mail e senha)
3. Faça login e acesse o portal em `/portal`
4. Cadastre um pet, um endereço no perfil e teste agendamento ou loja

---

## Checklist

| Item | Obrigatório |
|------|-------------|
| PostgreSQL em execução | Sim |
| `npm run db:migrate` na API | Sim |
| `.env` da API com `DATABASE_URL` e `JWT_SECRET` | Sim |
| `.env` do front com `VITE_API_URL` | Sim |
| `SENSITIVE_DATA_KEY` e `VITE_SENSITIVE_DATA_KEY` **idênticas** | Sim |
| `git lfs pull` no front | Sim (imagens) |
| SMTP configurado | Não (só para e-mail de recuperação de senha) |

---

## Problemas comuns

### Erro ao cadastrar ou salvar perfil (criptografia)

- Confirme que `SENSITIVE_DATA_KEY` (API) e `VITE_SENSITIVE_DATA_KEY` (front) são **iguais**
- Reinicie os dois servidores após alterar o `.env`

### API não inicia

- Verifique se o PostgreSQL está rodando
- Confira `DATABASE_URL` no `.env` da API

### Imagens quebradas no front

```bash
cd hackathon
git lfs install
git lfs pull
```

### Erro de CORS

Inclua a URL do front em `WEB_ORIGIN` no `.env` da API, por exemplo:

```env
WEB_ORIGIN=http://localhost:8443,http://localhost:5173
```

---

## Scripts úteis

### API (`hackathon-api`)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor com hot reload |
| `npm run start` | Servidor em produção |
| `npm run db:migrate` | Aplica migrations no banco |
| `npm test` | Testes automatizados |

### Front (`hackathon`)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor Vite (porta 8443) |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |

---

## Por que o `.env` não vai para o GitHub?

O `.env` contém segredos (JWT, chave de criptografia, senha do banco). Por segurança, ele **não é commitado**. Cada máquina ou ambiente de deploy recebe seu próprio `.env` (ou variáveis configuradas no painel do host).

Use `.env.example` como modelo — copie para `.env` e preencha os valores reais.

---

## Deploy (produção)

Não envie `.env` para o repositório. Configure as variáveis no painel do provedor (Vercel, Railway, Render, etc.):

**API:** `DATABASE_URL`, `JWT_SECRET`, `SENSITIVE_DATA_KEY`, `WEB_ORIGIN`, `PORT`

**Front:** `VITE_API_URL`, `VITE_SENSITIVE_DATA_KEY`

Após o build do front, reinicie a API se alterar chaves ou origens CORS.
