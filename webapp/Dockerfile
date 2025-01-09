FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_URL ${VITE_API_URL}
ENV VITE_API_URL ${VITE_API_URL}

COPY . .

RUN npm install

RUN npm run build

USER node

# Prepare production image

FROM node:20-alpine AS prod

WORKDIR /app
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 node || true
RUN adduser --system --uid 1001 node || true

COPY --chown=node:node --from=build /app/dist dist
COPY --chown=node:node --from=build /app/node_modules node_modules
COPY --chown=node:node --from=build /app/package.json package.json

# 'serve' will be used to serve the app on default port 3000
RUN npm i -g serve

USER node

CMD ["serve", "-s", "/app/dist"]
