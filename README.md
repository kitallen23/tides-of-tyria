# Dev

## Running the app

Ensure you are running the correct node version (`nvm use`).

Simply run `yarn install` and `yarn dev`. I haven't yet successfully dockerized the app for dev.

# Production

All commands are included in the scripts section of package.json. Please see there for details.

## Build & run the docker image

```
yarn docker:prod
```

## Stopping & cleanup

```
yarn docker:stop:prod
yarn docker:rm:prod
```
