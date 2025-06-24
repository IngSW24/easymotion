# Going to production

## Table of Contents

- [Initial Setup](#initial-setup)
- [Deploying to VPS](#deploying-to-vps)
  - [DNS Configuration](#dns-configuration)
  - [Sample Docker Compose Configuration](#sample-docker-compose-configuration)
- [Other deployments](#other-deployments)
  - [Railway](#railway)
  - [Serverless](#serverless)
  - [Kubernetes](#kubernetes)

This guide explains how to deploy the EasyMotion application to a production environment.

## Initial Setup

When first deploying the API, an initial admin user will be automatically created using the `INITIAL_USER_*` environment variables if no users exist in the database. This user can then create additional users through the application interface.

The API service requires several environment variables to be configured properly. These control database access, email functionality, authentication, and storage settings. All required variables are documented in the sample configuration below.

## Deploying to VPS

The application can be deployed to any VPS (AWS EC2, DigitalOcean Droplets, Azure Virtual Machines, Google Compute Engine, Aruba Cloud, OVH, etc). The deployment process involves:

1. Installing docker engine and docker compose on your system
2. Creating a `docker-compose.yml` file with proper configuration (see sample below)
3. Providing additional security measures if necessary (i.g. firewall setup, restricted access, etc.)
4. Starting the services with `docker compose up -d`. For production, you may want to run this command as part of a system service (e.g., using systemd) to ensure the application automatically restarts on reboot or failure.

### DNS Configuration

You will need to point your domain (e.g., `easymotion.it`) to the VPS static IP using an A record. Then define subdomains such as `api.easymotion.it` or `somethin.easymotion.it`, by using CNAME records that point to the root domain. This ensures that all relevant domains and subdomains resolve to your VPS.

```
| Type   | Name                  | Value           |
|--------|-----------------------|-----------------|
|  A     | easymotion.it         | vps ip address  |
|  CNAME | *.easymotion.it       | easymotion.it   |

```

### Sample Docker Compose Configuration

Below is a sample `docker-compose.yml` file demonstrating how to deploy the API and webapp Docker images together. Use this as a starting point and adapt it to your environment and secrets management needs.

```yaml
services:
  webapp:
    image: webapp-image-name
    restart: unless-stopped

  api:
    image: ghcr.io/ingsw24/easymotion-api:latest
    restart: unless-stopped
    depends_on:
      db:
        condition: service_started
    environment:
      # Database Configuration
      # Format: postgresql://user:pass@dbnetwork:dbport/dbname?schema=public
      - DATABASE_URL=url-to-access-db

      # CORS Configuration
      - FRONTEND_URL=url-that-serves-webapp

      # SMTP Configuration
      - SMTP_HOST=smtp-host # or mailhog
      - SMTP_PORT=465 # or mailhog port
      - SMTP_SECURE=true # false if using mailhog
      - SMTP_USER=your-smtp-user # not used by mailhog
      - SMTP_PASSWORD=your-smtp-password # not used by mailhog

      # JWT Configuration
      - JWT_SECRET=secret-to-sign-jwts
      - JWT_AUDIENCE=jwt-audience
      - JWT_ISSUER=jwt-issues
      - JWT_EXPIRES_IN=jwt-expiration # e.g. 1800s
      - JWT_REFRESH_EXPIRES_IN=refresh-jwt-expiration # e.g. 3d

      # Initial User Configuration
      # Generated if no user exists, enabling creation of additional users via API
      - INITIAL_USER_ID=a1064fca-cbac-4fa6-9a12-04e3842fd8bd
      - INITIAL_USER_EMAIL=admin@easymotion.it
      - INITIAL_USER_PASSWORD=ingsw24easymotion!

      # AWS Configuration (for static assets)
      - USE_S3=true # if false, mocks S3

      # Required only if USE_S3=true
      - AWS_ACCESS_KEY_ID=access-key-id
      - AWS_SECRET_ACCESS_KEY=secret-access-key
      - AWS_REGION=region
      - AWS_S3_BUCKET=bucket-name
      - MAX_IMAGE_SIZE=500000

      # PDF Generation (optional)
      - PDF_API_KEY=api-key

  db:
    image: postgres
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: always
    environment:
      - POSTGRES_PASSWORD=3Mj5vlY3Ab3rHFZuD0Vajw9eCE4lGTgEFUy6tTgdyiQw
      - POSTGRES_USER=easymotionprod
      - POSTGRES_DB=easymotion
      - POSTGRES_HOST=db
      - POSTGRES_PORT=5432

  # You can directly use nginx
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      # Configure reverse proxy with SSL certificates unless using nginx-proxy-manager
      - /your/nginx/configuration.conf:/etc/nginx/nginx.conf:ro
      - /your/certificates:/certs
    depends_on:
      - api
    restart: always

  # OTHERWISE, you can use nginx-proxy-manager to manage the reverse
  # proxy with a visual interface and auto generate SSL certificates
  # (https://nginxproxymanager.com/guide/)
  npm:
    image: jc21/nginx-proxy-manager:latest
    restart: unless-stopped
    ports:
      - 80:80 # Public HTTP Port
      - 443:443 # Public HTTPS Port
      - "81:81" # you can ad a proxy entry for the admin panel and then disable 81 port
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt

volumes:
  # Create external volume with: docker volume create pgdata
  # This ensures DB data persistence
  pgdata:
    external: true
```

If you want a shared/collaborative way of managing the production environment you can use tools such as [dockge](https://github.com/louislam/dockge) or [portainer](https://www.portainer.io/).

## Other deployments

### Railway

If you prefer not to deploy easymotion on your own VPS, an easy and fast alternative is [Railway](https://railway.com). Railway enables you to deploy databases and Docker images together, automatically connecting them with features like automatic image updates, built-in HTTPS, auto-generated domains, and a sleep mode to help save costs. Note that you will need to configure secrets differently to ensure the services can communicate according to Railway's requirements. For more details, refer to the [Railway documentation](https://docs.railway.com/).

### Serverless

It is theoretically possible to deploy EasyMotion in a serverless environment such as [Vercel](https://vercel.com/). The React webapp can be deployed to Vercel with minimal configuration, as it is a standard static site. For the API, there are community guides and documentation on how to deploy [NestJS on Vercel](https://dev.to/abayomijohn273/deploying-nestjs-application-using-vercel-and-supabase-3n7m), but you may need to adapt the project for serverless compatibility (e.g., cold starts, file system access, and environment variable handling).

**Important:** The PostgreSQL database cannot be hosted on Vercel and must be deployed elsewhere (such as Supabase, Railway, Vercel Neon or a managed cloud database). Also, some features or performance characteristics may differ from a traditional server/VPS deployment, so evaluate your requirements and test thoroughly before choosing this approach.

### Kubernetes

You can also deploy EasyMotion using a Kubernetes cluster (such as k3s or a full k8s setup). This approach allows for scalable and robust production deployments, but it requires a good understanding of Kubernetes concepts and manual configuration of resources like Deployments, Services, Ingress, Secrets, and Persistent Volumes. There are no official Helm charts or manifests provided, so you will need to create your own manifests tailored to your environment and security requirements.
