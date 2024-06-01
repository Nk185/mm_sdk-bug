#!/bin/bash

cd ../
rm -r ./dist
docker build --rm --tag mm_integration_ext_img --file ./build_tools/Dockerfile .
docker run --name mm_integration_ext --rm --detach mm_integration_ext_img
docker exec mm_integration_ext npm run build
docker cp mm_integration_ext:/usr/src/app/dist ./dist
docker rm --force mm_integration_ext