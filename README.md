# EasyMotion

This repository contains both the **API** and **WebApp** projects for EasyMotion.

## Do you like videos more?

You can follow a quick explanation of the repository and its initial configuration in a quick video [here](https://www.loom.com/share/57bff56af68040f3b9099a492d284153?sid=07ebf338-da86-4538-a9c9-9fe3d601a8dd)!

## Configure the dev environment

The whole dev environment can be spun up using only docker compose. However, there are some requirements that need to be fulfilled so that everything can run properly.

### Install docker

You can find docker installation guides on [the official website](https://www.docker.com/).

### Define domain in /etc/hosts

You must edit your /etc/hosts file adding an entry that binds the domain `easymotion.devlocal` to `127.0.0.1`.

- On MacOS and Linux, the file will be located at `/etc/hosts`
- On Windows, the file will be located at `C:\Windows\System32\Drivers\etc\hosts`

You need to add the following line to the bottom of the file.

```
127.0.0.1 easymotion.devlocal
127.0.0.1 api.easymotion.devlocal
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
cp .env.example .env
```

If you are using **Windows**, you need to also add the following variable in your .env file.

```
POLLING=true
```

### Spin up the dev environment

- Run `docker compose up` (the first time it will take a while because it will install dependencies)
- Visit
  - **api** at [https://api.easymotion.devlocal/swagger](https://api.easymotion.devlocal/swagger)
  - **webapp** at [https://easymotion.devlocal](https://easymotion.devlocal)
  - **pgAdmin** at [http://localhost:8083](http://localhost:8083):
    - username: `db@easymotion.devlocal`
    - password: `1234`
    - The server configuration must use the connection parameters declared in the `.env` file

> ⚠️ **HTTPs!** When you visit the https URIs, your browser will probably complain about connection being not private despite the certificate. This is ok since the development certificates are not signed by a real certification authority. Since it's a local connection, you should be able to proceed by clicking `Advanced > Proceed to website`. **You need to accept risks for both API and webapp to ensure communication between the two works**.

### Run DB migrations and seed

Finally, you will need to apply database migrations by running:

```bash
docker compose exec api npm run prisma:migrate-dev
```

You can then seed the database by running:

```bash
docker compose exec api npm run seed
```

---

## Interacting with the dev environment

The dev environment is completely handled by docker-compose, which spawns all the services and handles the dependencies between them.

You are **NOT** supposed to run commands using npm in projects subfolders. Everything should be done throught docker-compose by specifying the service you want to execute the command in.

#### Install packages

```bash
# api
docker compose exec api npm i [package-name]
# webapp
docker compose exec webapp npm i [package-name]
```

If you need to re-install all the packages you can simply erase the `node_modules` folder. This way, the service will run `npm ci` automatically on start.

#### Run migrations on DB

```bash
docker compose exec api npm run prisma:migrate-dev
```

#### Seeding DB with fake data

```bash
docker compose exec api npm run seed
```

#### Regenerate prisma client

```bash
docker compose exec api npm run prisma:generate-client
```

#### Regenerate webapp client

```bash
docker compose exec webapp npm run generate-client
```

#### Access psql shell

```bash
docker-compose exec db psql -U easymotion
```

#### Restart a service

```bash
# Shut it down
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

#### Rebuild images

```bash
docker compose build
```

#### Shutdown the dev environment

```bash
# add --remove-orphans if you get warnings about orphans containers
docker compose down
```

#### Other commands

For more information about the usage of docker compose, check the [official docs](https://docs.docker.com/reference/cli/docker/compose/).

If you use Visual Studio Code, the [Official Docker Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) could be helpful to keep tracks of the running containers.

---

# Troubleshooting

### ️If you start getting errors with modules

At some point you might see errors suggesting that some node module is not installed. The possible reasons are two:

- Another dev added dependencies which you haven't installed
- Something is broken

First, try to install any new dependency if there's any. You can do it by running

```bash
docker compose exec [service-name] npm i
```

If your container was running, you may also want to try to restart it

```bash
docker compose restart [service-name]
```

If issues **persist**, you can do it the hard way by

- Turning off all the services with `docker compose down`
- Deleting the `api/node_modules` folder
- Deleting the `webapp/node_modules` folder
- Rebuilding the images with `docker compose build`
- Restarting everything

### If you have issues with port bindings

All the services are exposed towards the host machine. If you have an instance of PSQL running on your host machine, you won't be able to run the container on its default port (5432) since it's already taken.

You can either:

- Turn off the service instance on your machine
- Change the external binding port

If you want to change the external binding port, you can simply add one or more variables to the `.env` file as follows:

- `API_DEV_PORT=xxxx` (change api port)
- `WEB_DEV_PORT=xxxx` (change webapp port)
- `PG_DEV_PORT=xxxx` (change PostgreSQL port)
- `PG_ADMIN_PORT=xxxx` (change pgAdmin port)

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
