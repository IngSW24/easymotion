# Build the app

FROM node:20-slim AS base 

ARG VITE_API_URL ${VITE_API_URL}
ENV VITE_API_URL=${VITE_API_URL}

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apt update
RUN apt install -y openssl

FROM base AS build

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm -r build
RUN pnpm deploy --filter=api --prod /prod/api
RUN mv webapp/dist /prod/webapp

FROM build AS api

ENV NODE_ENV=production

COPY --from=build /prod/api /prod/api

WORKDIR /prod/api
EXPOSE 3000

CMD ["npm", "run", "start:prod:migrate"]

FROM node:20-alpine AS webapp

ENV NODE_ENV=production
RUN npm i -g serve

COPY --from=build /prod/webapp /prod/webapp

WORKDIR /prod/webapp
EXPOSE 3000

CMD ["serve", "-s", "/prod/webapp"]
