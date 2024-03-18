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


