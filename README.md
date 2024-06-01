# Metamask Integration extension example

## How to build

1. Install dependencies

```sh
bun install
```

2. Run build command

```sh
npm run build
```

3. Load the extension in Chrome from `dist` folder as described [here](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)

### Building without Nodejs installed
1. Install Docker

2. Run the script
```sh
./build_tools/build-via-docker.sh

```

3. Load the extension in Chrome from `dist` folder.

## How to develop

1. Install dependencies

```sh
bun install
```

2. Run `build:watch` command

```sh
bun run build:watch
```