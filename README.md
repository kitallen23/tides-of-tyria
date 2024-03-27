# Dev

## Running the app

Ensure you are running the correct node version (`nvm use`).

Simply run `yarn install` and `yarn dev`. I haven't yet successfully dockerized the app for dev.

# Staging

All commands are included in the scripts section of package.json. Please see there for details.

## Build & run the docker image locally

```bash
yarn docker:stage
```

## Stopping & cleanup

```bash
yarn docker:stop:stage
yarn docker:rm:stage
```

# Production (hosting on homelab)

Build the image locally and copy it to the LXC:

```bash
yarn docker:build:prod
yarn docker:save:prod
scp tides-of-tyria.tar root@192.168.1.26:/root/tides-of-tyria/
```

SSH into the LXC and run:

```bash
docker load < tides-of-tyria.tar
```
