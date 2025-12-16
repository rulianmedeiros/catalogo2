FROM node:18-alpine

# --- CORREÇÃO AQUI ---
# Instala OpenSSL e bibliotecas de compatibilidade necessárias para o Prisma
RUN apk add --no-cache openssl libc6-compat
# ---------------------

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Gera o cliente do Prisma
RUN npx prisma generate

# Build do Next.js (com o hack de ignorar erros de lint)
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

# O comando de inicialização
CMD npx prisma db push && npm start
