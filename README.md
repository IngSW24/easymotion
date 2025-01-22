# EasyMotion

This repository contains both the **API** and **WebApp** projects for EasyMotion.

### Define domain in /etc/hosts

You must edit your /etc/hosts file adding an entry that binds the domain `easymotion.devlocal` to `127.0.0.1`.

- On MacOS and Linux, the file will be located at `/etc/hosts`
- On Windows, the file will be located at `C:\Windows\System32\Drivers\etc\hosts`

You need to add the following line to the bottom of the file.

```
127.0.0.1 easymotion.devlocal
127.0.0.1 api.easymotion.devlocal
127.0.0.1 mail.easymotion.devlocal
```

Then you can save and quit. Note that this application requires sudo/administration priviledges.

### Clone the repository

- https:

  ```bash
  git clone https://github.com/ingsw24/easymotion
  ```

- ssh:

  ```bash
  git clone git@github.com:IngSW24/easymotion.git
  ```

### Create environment variables

You can copy the example file to start with default variables.

```
pnpm env:boostrap
```

### Spin up the dev environment

- Run `pnpm install` to install dependencies
- Run `pnpm services:up` to startup services
- Run `pnpm api:migrate` to migrate the database
- Run `pnpm api:seed` to seed the database
- Run `pnpm webapp:client` to generate the webapp client
- Run `pnpm all` to start the whole application
- Visit
  - **api** at [https://api.easymotion.devlocal/swagger](https://api.easymotion.devlocal/swagger)
  - **webapp** at [https://easymotion.devlocal](https://easymotion.devlocal)
  - **mailhog** at [https://mail.easymotion.devlocal](https://mail.easymotion.devlocal)

> ⚠️ **HTTPs!** When you visit the https URIs, your browser will probably complain about connection being not private despite the certificate. This is ok since the development certificates are not signed by a real certification authority. Since it's a local connection, you should be able to proceed by clicking `Advanced > Proceed to website`. **You need to accept risks for both API and webapp to ensure communication between the two works**.

---

#### Clean repository

```bash
pnpm clean
```

#### Run tests

```bash
# All the projects
pnpm test

# Single project
pnpm --filter [webapp|api] test
```

#### Regenerate prisma client

> Note: this command is always executed automatically when applying migrations

```bash
pnpm api:client
```

#### Regenerate webapp client

```bash
pnpm webapp:client
```

#### Regenerate openapi schema

```bash
pnpm api:schema
```

#### Access psql shell

```bash
docker compose exec db psql -U easymotion
```

#### Restart a service

```bash
docker compose restart [service-name]
```

#### Check running services

```bash
docker compose ps
```

#### Attach to logs

```bash
docker compose logs -f [service-name]
```

#### Erase DB data

```bash
docker compose down # if services are running
docker volume rm easymotion_pgdata
docker volume rm easymotion_pgadmin_data
```

#### Rebuild docker images

```bash
docker compose build
```

#### Shutdown the services

```bash
# add --remove-orphans if you get warnings about orphans containers
pnpm services:down
```

---

## How to develop

- Create a new branch from the `develop` branch
- Checkout your own branch ensuring that its name follows the standard JIRA naming conventions for GitHub integrations
- Develop your feature on your branch, eventually rebasing or merging from other branches if you need to do so
- Open a Pull Request on the `develop` branch and wait for code review and approval

### Code review

| Programmer         | Reviewer           |
| ------------------ | ------------------ |
| @Nicola Revelant   | @pittis.matteo     |
| @pittis.matteo     | @Andrea Cantarutti |
| @Andrea Cantarutti | @Arghittu Thomas   |
| @Arghittu Thomas   | @Barbetti Giovanni |
| @Barbetti Giovanni | @Nicola Revelant   |

### Notes

- Branch `develop` will be aligned with the current sprint progress
- The production version will be aligned with the status of the `main` branch
