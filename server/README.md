# Brevly Server

API backend para o Brevly - um encurtador de URLs.

## Tecnologias

- **Fastify** - Framework HTTP
- **Drizzle ORM** - ORM para PostgreSQL
- **Zod** - Validação de schemas
- **Cloudflare R2** - Armazenamento de ficheiros (exportação CSV)
- **Vitest** - Testes

## Pré-requisitos

- Node.js 20+
- pnpm
- PostgreSQL
- Conta Cloudflare R2 (para exportação de links)

## Configuração

1. Copiar o ficheiro de ambiente:
```bash
cp .env.template .env
```

2. Preencher as variáveis de ambiente no `.env`:
```env
PORT=3333
NODE_ENV=development

DATABASE_URL=postgres://user:password@localhost:5432/links

CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ACCESS_KEY_ID=
CLOUDFLARE_SECRET_ACCESS_KEY=
CLOUDFLARE_BUCKET_NAME=
CLOUDFLARE_PUBLIC_URL=
```

3. Instalar dependências:
```bash
pnpm install
```

4. Executar migrações da base de dados:
```bash
pnpm db:migrate
```

## Executar

### Desenvolvimento
```bash
pnpm dev
```

### Produção
```bash
pnpm build
pnpm start
```

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | Inicia servidor em modo desenvolvimento |
| `pnpm build` | Compila o projeto |
| `pnpm start` | Inicia servidor em produção |
| `pnpm test` | Executa testes |
| `pnpm test:watch` | Executa testes em modo watch |
| `pnpm db:generate` | Gera migrações |
| `pnpm db:migrate` | Aplica migrações |
| `pnpm db:studio` | Abre Drizzle Studio |
| `pnpm style:check` | Verifica e corrige estilo do código |

## API

A documentação da API está disponível em `/docs` quando o servidor está a correr.

**Endpoints principais:**
- `POST /links` - Criar link encurtado
- `GET /links` - Listar todos os links
- `GET /links/:shortCode` - Obter link por código
- `PATCH /links/:shortCode/increment` - Incrementar contador de acessos
- `DELETE /links/:shortCode` - Eliminar link
- `GET /links/export` - Exportar links para CSV

## Docker

```bash
docker-compose up -d --build
```