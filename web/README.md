# Brevly Web

Aplicação web para o Brevly - um encurtador de URLs.

## Tecnologias

- **React 19** - Biblioteca UI
- **TanStack Router** - Routing
- **TanStack Query** - Gestão de estado do servidor
- **Tailwind CSS v4** - Styling
- **Axios** - Cliente HTTP
- **Vite** - Build tool

## Pré-requisitos

- Node.js 20+
- pnpm
- Server API a correr (ver `/server`)

## Configuração

1. Copiar o ficheiro de ambiente:
```bash
cp .env.template .env
```

2. Configurar as variáveis de ambiente no `.env`:
```env
VITE_API_BASE_URL="http://localhost:3333"
VITE_APP_DEBUG_API=true
```

3. Instalar dependências:
```bash
pnpm install
```

## Executar

### Desenvolvimento
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Produção
```bash
pnpm build
pnpm preview
```

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `pnpm dev` | Inicia servidor de desenvolvimento na porta 3000 |
| `pnpm build` | Compila o projeto para produção |
| `pnpm preview` | Pré-visualiza a build de produção |
| `pnpm style:check` | Verifica e corrige estilo do código |

## Funcionalidades

- Criar links encurtados
- Listar links criados
- Copiar link para clipboard
- Eliminar links
- Exportar links para CSV
- Redirecionamento automático via short code