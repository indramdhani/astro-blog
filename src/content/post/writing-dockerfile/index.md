---
title: "Writing Dockerfile"
publishDate: "07 March 2021"
description: "Dockerfile define environment and avoid discrepancies with dependencies or runtime versions."
categories:
  - "docker-series"
tags:
  - "docker-series"
  - "docker"
  - "dockerfile"
---

The Dockerfile specifies what to be included in your application container when it is executed. Dockerfile define environment and avoid discrepancies with dependencies or runtime versions.

### Create Dockerfile on your project's root directory

```bash
nano Dockerfile
```

Docker images are created using a succession layered images that build on one another. The first step is to add the base image for the application that will form the starting point of the application.

Find your suitable image [here](https://hub.docker.com/_/node/). Let's use `node:12-alpine` as it is the latest LTS version of NodeJS.

```bash
FROM node:12-alpine
```

Each Dockerfile must begin with `FROM` instruction.

By default the image include Node.js and npm and also non-root user that should be used to running your application. It is recommended security practice to avoid running container as root.

We will use **node** user's home directory as the working directory and set them as user inside the container.

Let's create `node_modules` directory under app directory in our working directory and set the ownership of the directory

```
FROM node:12-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
```

Let's set the working directory

```
FROM node:12-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app
```

Then copy the `package.json` and `package-lock.json`

```
FROM node:12-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./
```

Adding this `COPY` instruction before running `npm install` or copying the application code allows us to take advantage of Docker’s caching mechanism. At each stage in the build, Docker will check to see if it has a layer cached for that particular instruction. If we change `package.json`, this layer will be rebuilt, but if we don’t, this instruction will allow Docker to use the existing image layer and skip reinstalling our node modules.

Let's switch to non-root user / **node** user.

```
FROM node:12-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node
```

then run npm install

```
FROM node:12-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install
```

then copy the application code with the appropriate permission to application directory

```
FROM node:12-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .
```

Let's expose the port of `3000` on the container and start the application

```
FROM node:12-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "npm", "run" ]
```

`EXPOSE` does not publish the port, but functions a way to documenting which ports on the container will be published at runtime.

Note that there should be always only one `CMD` instruction for each Dockerfile.

Save the dockerfile once you finished editing.
