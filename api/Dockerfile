# Setup dev image

FROM node:20-alpine as dev

RUN apk add --no-cache libc6-compat
RUN apk add --no-cache openssl
RUN apk add --no-cache curl

WORKDIR /app

ENV NODE_ENV development

RUN addgroup --system --gid 1001 node || true
RUN adduser --system --uid 1001 node || true

COPY --chown=node:node . .

USER node

# Build the app

FROM node:20-alpine as build

WORKDIR /app
RUN apk add --no-cache libc6-compat

ENV NODE_ENV production

RUN addgroup --system --gid 1001 node || true
RUN adduser --system --uid 1001 node || true

COPY --chown=node:node --from=dev /app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

RUN npm install --production && npm cache clean --force

USER node

# Prepare production image

FROM node:20-alpine as prod

WORKDIR /app
RUN apk add --no-cache libc6-compat

ENV NODE_ENV production

RUN addgroup --system --gid 1001 node || true
RUN adduser --system --uid 1001 node || true

COPY --chown=node:node --from=build /app/dist dist
COPY --chown=node:node --from=build /app/node_modules node_modules
COPY --chown=node:node --from=build /app/prisma prisma
COPY --chown=node:node --from=build /app/package.json package.json

USER node

# ensure migration are applied before starting the API
CMD ["npm", "run", "start:prod:migrate"]

