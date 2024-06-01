#!/bin/bash

cd ../

docker run --name mm_integration_ext_watch --rm --detach --volume ./:/usr/src/app --workdir /usr/src/app node:22-alpine3.19 top
docker exec -it mm_integration_ext_watch sh -c "apk update && apk upgrade && apk add python3 make g++"
docker exec -it --workdir /usr/src/app mm_integration_ext_watch sh -c "npm install && npm run build:watch"