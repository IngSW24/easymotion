# Deployment Documentation

## Table of Contents

- [Overview](#overview)
- [Release Process](#release-process)
- [Required Configuration](#required-configuration)
  - [GitHub Secrets](#github-secrets)
  - [GitHub Variables](#github-variables)
- [Docker Image Tags](#docker-image-tags)
- [Environment Selection](#environment-selection)
- [Example Release Tags](#example-release-tags)

## Overview

The project uses GitHub Actions for continuous deployment. When a new release is created on GitHub, the CI/CD pipelines automatically build and push Docker images to the GitHub Container Registry (ghcr.io). The images are tagged with both the release version and a `latest` tag (or `latest-beta` for beta releases).

## Release Process

1. Create a new GitHub release with a tag following the format (see [Release Guide](./release.md) for detailed instructions):

   - `v*` or `api-v*` for API releases
   - `v*` or `webapp-v*` for WebApp releases
   - Append `-beta` for beta releases (e.g., `v1.0.0-beta`)

2. The CI/CD pipeline will:
   - Build the Docker image
   - Tag it with the version number and `latest`/`latest-beta`
   - Push it to the GitHub Container Registry
   - Send a notification to Discord upon successful deployment

## Required Configuration

Before deploying, you need to configure the following in your GitHub repository settings:

### GitHub Secrets

| Secret            | Description                                      |
| ----------------- | ------------------------------------------------ |
| `DISCORD_WEBHOOK` | Discord webhook URL for deployment notifications |

### GitHub Variables

| Variable               | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| `VITE_API_URL`         | Base API URL for production environment                       |
| `VITE_STAGING_API_URL` | Base API URL for staging environment (used for beta releases) |
| `VITE_STATIC_URL`      | URL for serving static assets (images, etc.)                  |

## Docker Image Tags

The CI/CD pipeline generates Docker images with the following naming pattern:

- API: `ghcr.io/ingsw24/easymotion-api:[version]`
- WebApp: `ghcr.io/ingsw24/easymotion-webapp:[version]`

Where `[version]` can be:

- The release version (e.g., `1.0.0`, `1.0.0-beta`)
- `latest` for the most recent stable release
- `latest-beta` for the most recent beta release

## Environment Selection

The pipeline automatically determines the environment based on the release tag:

- Regular releases (e.g., `v1.0.0`) use production configuration (`VITE_API_URL`)
- Beta releases (e.g., `v1.0.0-beta`) use staging configuration (`VITE_STAGING_API_URL`)

## Example Release Tags

```bash
# API Releases
v1.0.0          # Production API release
api-v1.0.0      # Production API release
v1.0.0-beta     # Beta API release
api-v1.0.0-beta # Beta API release

# WebApp Releases
v1.0.0          # Production WebApp release
webapp-v1.0.0   # Production WebApp release
v1.0.0-beta     # Beta WebApp release
webapp-v1.0.0-beta # Beta WebApp release
```

For information about running the Docker images, refer to the [build documentation](build.md#sample-docker-compose-configuration).
