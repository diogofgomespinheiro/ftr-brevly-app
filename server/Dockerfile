FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

FROM node:22-alpine AS runner

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY --from=dependencies /app/node_modules ./node_modules

COPY --chown=nodejs:nodejs . .

USER nodejs

EXPOSE 3000

CMD ["npm", "run", "start"]