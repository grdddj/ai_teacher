# Teacher tool

- this repository stores a prototype application to be used by teachers and students for more effective learning
- the requirements for the app are stored in the `requirements.pdf` file

## Project setup and running

```bash
npx nuxi@latest init scio-app
curl -fsSL https://bun.sh/install | bash
bun install
bun dev
```

## Dev commands

```bash
bun lint
bun lint:fix
bun format
```

## Deployment

```bash
bun run build
bun run preview

node .output/server/index.mjs

bun run build
npm install -g pm2
pm2 start .output/server/index.mjs --name "scio-app"
pm2 save
pm2 startup
```
