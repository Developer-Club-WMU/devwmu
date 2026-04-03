FROM node:24-alpine
WORKDIR /app
RUN apk add --no-cache python3 make g++
RUN corepack enable && corepack prepare pnpm --activate
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
ENV SKIP_ENV_VALIDATION=1
RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate
COPY . .
RUN pnpm build
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["node", ".output/server/index.mjs"]