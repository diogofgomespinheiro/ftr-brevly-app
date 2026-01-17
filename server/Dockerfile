FROM node:22-alpine AS base

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app

COPY package.json ./
COPY pnpm-*.yaml ./

RUN pnpm install

FROM base AS build

WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN pnpm build
RUN pnpm prune --prod

FROM node:22-alpine AS runner

USER 1000

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

EXPOSE 3333

ENV PORT=3333
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]