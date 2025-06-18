# This repository is deprecated. 

# EigenDA Docs

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```bash
yarn
```

If yarn isn't installed yet, [run the following command](https://yarnpkg.com/getting-started/install) first:

```bash
corepack enable
```

### Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
yarn build
# to test out the fully built site
yarn serve
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
