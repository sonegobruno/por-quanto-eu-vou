# ─── Stage 1: Build ───────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─── Stage 2: Nginx (arquivos estáticos) ──────────────────────
FROM nginx:alpine AS nginx

COPY --from=builder /app/dist/por-quanto-eu-vou/browser /usr/share/nginx/html
COPY infra/prod/nginx.conf /etc/nginx/conf.d/default.conf

# ─── Stage 3: Node SSR ────────────────────────────────────────
FROM node:22-alpine AS ssr

WORKDIR /app

COPY --from=builder /app/dist/por-quanto-eu-vou/server ./server
COPY --from=builder /app/dist/por-quanto-eu-vou/browser ./browser
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

EXPOSE 4000
CMD ["node", "server/server.mjs"]
