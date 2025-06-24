# 🚀 Release Procedure for API and WebApp Components

This document outlines the procedure for creating an official release of the API and WebApp components, enabling the automatic execution of the build and deploy pipeline.

## Table of Contents

- [🔧 Prerequisites](#🔧-prerequisites)
- [🚀 Release Creation Procedure](#🚀-release-creation-procedure)
  - [1. Access the GitHub Repository](#1-access-the-github-repository)
  - [2. Navigate to the Releases Section](#2-navigate-to-the-releases-section)
  - [3. Tag Selection](#3-tag-selection)
  - [4. Select the Reference Branch](#4-select-the-reference-branch)
  - [5. Fill in the Changelog](#5-fill-in-the-changelog)
  - [6. Publish the Release](#6-publish-the-release)
- [✅ Post-Publication Automatic Actions](#✅-post-publication-automatic-actions)
- [📚 Additional Notes](#📚-additional-notes)

## 🔧 Prerequisites

- Write access to the GitHub repository.
- Permissions to create Tags and Releases.
- Ensure the code to be released has passed all tests on the designated release branch (`develop` or `main`).

---

## 🚀 Release Creation Procedure

### 1. Access the GitHub Repository

Access the GitHub repository of the project (API or WebApp).

### 2. Navigate to the Releases Section

- Click on **"Releases"** in the repository menu.
- Click on **"Draft a new release"**.

### 3. Tag Selection

Enter the tag name according to the conventions shown below:

| Tag Name Format      | Builds Triggered                                | Environment |
| -------------------- | ----------------------------------------------- | ----------- |
| `vX.Y.Z`             | Build and push Docker images for API and WebApp | Production  |
| `vX.Y.Z-beta`        | Build and push Docker images for API and WebApp | Staging     |
| `api-vX.Y.Z`         | Build and push Docker image for API             | Production  |
| `api-vX.Y.Z-beta`    | Build and push Docker image for API             | Staging     |
| `webapp-vX.Y.Z`      | Build and push Docker image for WebApp          | Production  |
| `webapp-vX.Y.Z-beta` | Build and push Docker image for WebApp          | Staging     |

**Examples of valid tags:**

- `api-v1.2.3-beta`
- `webapp-v1.2.3-beta`
- `v1.2.3-beta`
- `api-v1.2.3`
- `webapp-v1.2.3`
- `v1.2.3`

### 4. Select the Reference Branch

- Choose the branch from which to release (`main` or other designated branch).
- Ensure the selected commit corresponds to the one intended for release.

### 5. Fill in the Changelog

In the **"Describe this release"** field, provide a clear and concise changelog including:

- Key new features.
- Any bug fixes.
- A note on breaking changes, if any.

**Example:**

```
## Release API v1.2.3

- Introduced OAuth2 authentication
- Fixed bug on /users endpoint
- Optimized queries to improve performance
```

> You can also autogenerate the changelog using the specific button on the release page

### 6. Publish the Release

Click **"Publish release"**.

---

## ✅ Post-Publication Automatic Actions

Once the release is published:

- The GitHub Actions pipeline is automatically triggered.
- Docker images are built and published based on the tag provided.
- `-beta` images are deployed to staging environments.
- Tags without `-beta` are used for production environments.
- Any build or push errors will trigger email notifications.

---

## 📚 Additional Notes

- Follow semantic versioning: `X.Y.Z`
  - **X**: Major (breaking changes)
  - **Y**: Minor (backward-compatible features)
  - **Z**: Patch (bug fixes)
- `-beta` images must **not** be used in production environments.
