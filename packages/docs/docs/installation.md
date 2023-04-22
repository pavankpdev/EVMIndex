---
sidebar_position: 2
---

# Installation

Clone repository
```bash
git clone https://github.com/pavankpdev/EVMIndex.git evmindex
```

This is a monorepo, so you need to install the dependencies for each package separately.
You can use `npm`, `yarn` or `pnpm` to install the dependencies.

navigate to indexer package
```bash
cd packages/indexer
```

Install dependencies
```bash
npm install 
# or
yarn
# or
pnpm install
```

Setup ENVs, you might to update the values inside the `.env` file
```bash
cp .env .example.env
```

> NOTE: Update `src/setup.ts` file to add your contracts and events to be indexed

Run the Indexer
```bash
npm run dev --[type]
# or 
yarn dev --[type]
#or
pnpm dev --[type]
```
> The Indexer requires a command-line argument to run. Here's a list of valid arguments:
1. `--index-past-logs`: to index only past logs
2. `--index-live`: to index only live events
3. `--index-all`: to index both past logs and live events

That's it! You're all set to start using EVMIndex. 
