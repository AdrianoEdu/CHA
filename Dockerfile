# =========================
# STAGE 1 - BUILDER
# =========================
FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y \
    openssl \
    ca-certificates

# 1. Copia dependências primeiro
COPY package*.json ./
COPY prisma ./prisma

# 2. Instala dependências
RUN npm ci

# 3. Copia resto do código
COPY . .

# 4. Prisma generate
RUN npx prisma generate

# 5. Build Next.js
RUN npm run build


# =========================
# STAGE 2 - RUNNER
# =========================
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN npm install bcryptjs
RUN npm install -g tsx

# Next standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Prisma runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

CMD ["node", "server.js"]