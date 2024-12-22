# Setup dev image

FROM node:20-alpine as dev

RUN apk add --no-cache libc6-compat
RUN apk add --no-cache openssl
RUN apk add --no-cache curl

WORKDIR /app

ENV NODE_ENV development

# Build the app

FROM node:20-alpine as build

WORKDIR /app
RUN apk add --no-cache libc6-compat

RUN addgroup --system --gid 1001 node || true
RUN adduser --system --uid 1001 node || true

COPY . .

RUN npm install

RUN npm run build

# Prepare production image

FROM node:20-alpine as prod

WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache openssl
RUN apk add --no-cache curl

ENV NODE_ENV production

RUN addgroup --system --gid 1001 node || true
RUN adduser --system --uid 1001 node || true

COPY  --from=build /app/dist dist
COPY  --from=build /app/node_modules node_modules
COPY  --from=build /app/prisma prisma
COPY  --from=build /app/package.json package.json

# ensure migration are applied before starting the API
CMD ["npm", "run", "start:prod:migrate"]

