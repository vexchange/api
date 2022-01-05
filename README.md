# Vexchange API
  
## Description
The readonly API for Vexchange, the Leading DEX on VeChain.

## Installation
The use of NVM (node version manager) is recommended.

```bash
$ nvm use
$ npm install
```

## Running the app

```bash
# replicate .env
$ cp .env.example .env

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

Deployment happens automatically, when pushing to the `prod` branch. 
However, if the steps ever need to be done manually, the below provides details: 

## Packaging

To build and test a docker image locally: 

```bash
# Build the docker image
$ docker build -t vex-api .
# Confirm it exists
$ docker image ls
REPOSITORY                                      TAG            IMAGE ID       CREATED          SIZE
vex-api                                         latest         6b6df8bff04f   40 seconds ago   1.14GB
# Launch a container from the docker image
$ docker run -p 80:80 vex-api
# Stop the docker container
$ docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                               NAMES
ad818d2dd294   vex-api   "docker-entrypoint.s…"   4 minutes ago   Up 4 minutes   0.0.0.0:80->80/tcp, :::80->80/tcp   modest_turing
$ docker stop ad818d2dd294
```

## Publishing to AWS ECR

To login to AWS and publish manually to ECR: 

```
aws sts get-session-token --serial-number arn:aws:iam::134627471322:mfa/whoever@proxima.capital --token-code XXXXXX
aws configure set aws_access_key_id XXXXXX
aws configure set aws_secret_access_key XXXXXX
aws configure set aws_session_token XXXXXX
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 134627471322.dkr.ecr.ap-northeast-1.amazonaws.com
docker build -t vex-api .
docker tag vex-api:latest 134627471322.dkr.ecr.ap-northeast-1.amazonaws.com/vex-api:latest
docker push 134627471322.dkr.ecr.ap-northeast-1.amazonaws.com/vex-api:latest
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

USD data (VET USD price) provided by [CoinGecko API](https://www.coingecko.com/en/api)

## Attribution

Powered by [Nestjs](https://github.com/nestjs/nest)
