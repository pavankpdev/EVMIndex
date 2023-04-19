
# EVMIndex

**EVMIndex** is a plug-and-play blockchain indexer for EVM chains, designed to simplify the process of indexing and retrieving blockchain data. With **EVMIndex**, you can easily set up your own EVM chain indexer on your infrastructure and use simple APIs to retrieve the indexed data.



## Features

- Plug-and-play setup for EVM chain indexing
- Self-hosted solution for maximum control and privacy
- Simple APIs for easy data retrieval
- Lightweight design for efficient performance
- Webhooks for real-time event notifications

## Installation

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
    