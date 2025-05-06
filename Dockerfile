# Base image
FROM node:22-slim AS base 

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apt update
RUN apt install -y openssl

# -----------------------------------------
# Deps stage: only fetch the store
# -----------------------------------------
FROM base AS deps

WORKDIR /usr/src/app

COPY pnpm-lock.yaml .

# This fetches packages into the store
RUN pnpm fetch

# -----------------------------------------
# Build layer: install deps and build
# -----------------------------------------
FROM base AS build

WORKDIR /usr/src/app

# Copy project source
COPY . .

# Copy store and lockfile from deps
COPY --from=deps /pnpm /pnpm
COPY --from=deps /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml

# Do install to create node_modules
RUN pnpm install

# Set the API URL for webapp
ARG VITE_API_URL ${VITE_API_URL}
ENV VITE_API_URL ${VITE_API_URL}

ARG VITE_STATIC_URL ${VITE_STATIC_URL}
ENV VITE_STATIC_URL ${VITE_STATIC_URL}

# Build steps
RUN pnpm -r build

RUN pnpm deploy --filter=api --prod /prod/api
RUN mv webapp/dist /prod/webapp

# -----------------------------------------
# API runtime
# -----------------------------------------
FROM base AS api

ENV NODE_ENV=production

COPY --from=build /prod/api /prod/api

WORKDIR /prod/api
EXPOSE 3000

CMD ["npm", "run", "start:prod:migrate"]

# -----------------------------------------
# Webapp runtime
# -----------------------------------------
FROM node:22-alpine AS webapp

ENV NODE_ENV=production
RUN npm i -g serve

COPY --from=build /prod/webapp /prod/webapp

WORKDIR /prod/webapp
EXPOSE 3000

CMD ["serve", "-s", "/prod/webapp"]
