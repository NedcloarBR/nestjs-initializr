FROM node:22-alpine AS base

WORKDIR /app

ARG BACKEND_INTERNAL_URL
ENV BACKEND_INTERNAL_URL=${BACKEND_INTERNAL_URL}

COPY yarn.lock .yarnrc.yml tsconfig.base.json ./
COPY .yarn .yarn

RUN corepack enable

FROM base AS deps

COPY package.json ./

RUN yarn install --immutable

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY package.json nx.json ./
COPY apps/frontend apps/frontend

RUN yarn nx build frontend

FROM base AS runner

ENV NODE_ENV=production

COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static

EXPOSE 3000

CMD ["node", "apps/frontend/server.js"]

