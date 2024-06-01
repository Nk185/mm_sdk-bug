FROM node:22-alpine3.19 as base
WORKDIR /usr/src/app
RUN apk update && apk upgrade && apk add python3 make g++

FROM base AS install_deps
RUN mkdir -p /temp/npm_deps
COPY package.json package-lock.json .npmrc /temp/npm_deps/
RUN cd /temp/npm_deps && npm install

FROM base AS release
COPY --from=install_deps /temp/npm_deps/node_modules node_modules
COPY . .


ENTRYPOINT top