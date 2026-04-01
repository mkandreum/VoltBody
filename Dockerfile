FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm ci

FROM base AS build
COPY . .
RUN npx prisma generate
RUN npm run build:all

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm ci --include=dev

# Limpiar cualquier artefacto residual de builds anteriores
RUN rm -rf /app/server/routes /app/server/*.js /app/public

COPY --from=build /app/dist ./dist
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Generar Prisma client con schema correcto
RUN npx prisma generate

RUN mkdir -p /app/uploads
EXPOSE 3000
CMD ["sh", "/app/docker-entrypoint.sh"]
