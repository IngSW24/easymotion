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
```

Then you can save and quit. Note that this application requires sudo/administration priviledges.

### Clone the repository

```bash
git clone https://github.com/ingsw24/easymotion
```

#### Create environment variables

In both the API and WebApp repository you must create the environment files. In the root directory of the repository you can run

```
cp webapp/.env.example .env
cp api/.env.example .env
```

This will provide default environment variables. If new variables need to be added, you will have to include them in your .env file. If you are adding new variables, you should also provide a default one in the .env.example file.

### Spin up the dev environment

- Run `docker compose up` (the first time it will take a while because it will install dependencies)
- Visit
  - API at [https://api.easymotion.devlocal](https://api.easymotion.devlocal)
  - WebApp at [https://easymotion.dev](https://easymotion.dev)
  - PgAdmin at [http://localhost:8083](http://localhost:8083) (this is supposed to be used for administration purposes, but not to model the DB since this is done through migrations)

⚠️ **Note**: when you visit the https URIs, your browser will probably complain about connection being not private despite the certificate. This is ok since the development certificates are not signed by a real certification authority. Since it's a local connection, you should be able to proceed by clicking `Advanced > Proceed to website`.

### Shutdown the dev environment

- Run `docker compose down`

If you also want to completely erase the DB data:

- Run `docker volume rm easymotion_pgdata`

If you want to erase the PgAdmin data:

- Run `docker volume rm easymotion_pgadmin_data`

## Usage

### Installing packages

Do **NOT** run npm commands directly in projects subfolders, instead do:

```bash
# Nest API
docker compose exec api npm install package-name

# Webapp
docker compose exec webapp npm install package-name
```

You can also use `docker compose attach [container-name]` to attach you shell to a specific container.

If you need to run specific commands in the services without starting them up (for example, to install new dependencies), you can do:

```bash
docker compose run [service] [command]
```

### What to do if you start getting errors with modules

Delete

- `api/node_modules`
- `webapp/node_modules`

Then, rebuild the docker images by running `docker compose build`.

### View logs

Docker compose, by default, attaches all the logs to the same stdout. This can be a bit overwhelming.

If you want to see logs from one or more specific applications you can run

```bash
# for the api
docker compose logs api

# for the webapp
docker compose logs webapp

# for nginx
docker compose logs nginx

# for db
docker compose logs db
```

You can also use the `-f` flag to attach to the log file and follow new content.

For more information about the usage of docker compose, check the [official docs](https://docs.docker.com/reference/cli/docker/compose/).

---

# How to develop

- Checkout your own branch ensuring that its name follows the standard JIRA naming conventions for GitHub integrations
- Develop your feature on your branch, eventually rebasing or merging from other branches if you need to do so
- Open a Pull Request on the `develop` branch and wait for code review and approval
- Branch `develop` will be aligned with the current sprint progress
- The production version will be aligned with the status of the `main` branch
