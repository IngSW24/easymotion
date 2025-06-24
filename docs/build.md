# Build Documentation

## Table of Contents

- [Local Building](#local-building)
  - [Building Individual Projects](#building-individual-projects)
  - [Building All Projects](#building-all-projects)
  - [Build Output](#build-output)
  - [Important Note About Webapp URLs](#important-note-about-webapp-urls)
- [Docker Images](#docker-images)
  - [About the Dockerfile](#about-the-dockerfile)
  - [Building API Image](#building-api-image)
  - [Building Webapp Image](#building-webapp-image)
  - [Deployment Note](#deployment-note)
- [Sample Docker Compose Configuration](#sample-docker-compose-configuration)

## Local Building

### Building Individual Projects

You can build any project by running:

```bash
pnpm --filter api build
pnpm --filter webapp build

# All in one
pnpm -r build
```

After building, you need to use `pnpm deploy` to create a proper and usable deploy folder for the API. You can then CD into that path and run the API (ensure you have an ENV file providing all the environment variables needed and a DB running)

```bash
# deploy pnpm output
pnpm deploy --filter=api --prod /your/api/deploy/path

# cd to the folder
cd /your/api/deploy/path

# run a simple db
docker run \
  --name test-postgres \
  --rm  \
  -e POSTGRES_DB=test \
  -e POSTGRES_USER=test \
  -e POSTGRES_PASSWORD=test \
  -p 5432:5432 \
  -d postgres

# create a .env file to populate with environment variables
touch /your/api/deploy/path/.env

# run the app
pnpm start:prod:migrate
```

For the webapp, you can instead manually copy the `webapp/dist` folder somewhere and serve it using any HTTP server (i.g. `python3 -m http.server -d ./webapp/dist`).

### Important Note About Webapp URLs

When building the webapp, the API and static asset URLs are set and cannot be changed without rebuilding. For example, if you build with `api.example.com`, the webapp will only work with that API URL. This is normal behavior for static React apps.

## Docker Images

### About the Dockerfile

The project produces two docker images (api and webapp) for deployment. A single Dockerfile was developed following the [pnpm docker usage guidelines](https://pnpm.io/it/docker). The Dockerfile uses a layered build approach to produce each image depending on the target used.

### Building API Image

```bash
docker build \
  . \
  --target api \
  --tag api-image-name
```

### Building Webapp Image

```bash
docker build \
  --build-arg VITE_API_URL=your-base-api-url \
  --build-arg VITE_STATIC_URL=your-base-static-url \
  . \
  --target webapp \
  --tag webapp-image-name
```

### Deployment Note

Deployment is automated via GitHub Actions, which are triggered on each GitHub release. Build variables for the webapp are sourced from GitHub Action secrets. Docker images are built and published to the GitHub Container Registry with versioned tags (e.g., `ghcr.io/org-name/image-name:version`). For detailed information on the CI/CD process, see [docs/cicd-deployment.md](./cicd-deployment.md).
