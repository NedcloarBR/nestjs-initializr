FROM node:22-alpine AS base

WORKDIR /app

COPY yarn.lock .yarnrc.yml tsconfig.base.json ./
COPY .yarn .yarn

RUN corepack enable

FROM base AS deps

COPY package.json ./

RUN yarn install --immutable

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY package.json nx.json ./
COPY apps/backend apps/backend

RUN yarn nx build backend

FROM base AS deps-prod

COPY --from=builder /app/apps/backend/dist/package.json ./package.json

RUN yarn install


FROM base AS runner

ENV NODE_ENV=production

COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./

EXPOSE 3000

CMD ["node", "main.js"]
