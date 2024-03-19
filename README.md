# Dev

## Running the app

Run the following command to build the docker image:

```
docker build -f Dockerfile.dev -t tides-of-tyria-dev .
```

Note: this command must be re-run every time we change the dockerfile, or when we change dependencies (any changes to package.json or yarn.lock)

Start the docker container using the command:

```
docker run -d -p 5173:3000 --name tides-of-tyria-dev tides-of-tyria-dev
```

# Production

## Build docker image

To build the docker image, run the following command:

```
docker build -t tides-of-tyria .
```

## Run the docker container

To run the docker container, run the following command:

```
docker run -d -p 5174:80 --name tides-of-tyria tides-of-tyria
```

## Stop running the docker container

To stop the docker container, first find it with:

```
docker ps
```

Then stop the container with:
```
docker stop <container-id-or-name>
```


