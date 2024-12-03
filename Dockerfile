# dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app

RUN apk add --no-cache libc6-compat yarn
COPY package.json .
COPY yarn.lock .
RUN yarn install

# build
FROM dependencies AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN yarn build

# run
FROM node:18-alpine AS runner
ENV PORT=3000
WORKDIR /app
COPY --from=builder /app/.next/standalone ./standalone
COPY --from=builder /app/.next/static ./standalone/.next/static
COPY --from=builder /app/public ./standalone/public
EXPOSE $PORT

CMD ["node", "standalone/server.js"]
