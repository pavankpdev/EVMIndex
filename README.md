# EVMIndex

Welcome to EVM Index - a simple and lightweight indexer for EVM chains that allows you to easily index and retrieve data.
With EVM Index, you can easily set up your own indexer on your infrastructure and configure it using a simple config file.

Plus, with real-time event notifications using webhooks, you can stay up-to-date on the latest data changes on the chain.
Start exploring EVM Index today and simplify your blockchain data retrieval process.

Documentation [here](https://www.evmindex.dev/)

Examples [here](https://github.com/pavankpdev/EVMIndex/tree/main/packages/examples/express-ts)


## Features

- Plug-and-play setup for EVM chain indexing
- Self-hosted solution.
- Simplified configuration using a simple config file
- Lightweight design for efficient performance
- Webhooks for real-time event notifications

## Examples
1. [NodeJs and Express with TypeScript](https://github.com/pavankpdev/EVMIndex/tree/main/packages/examples/express-ts)

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 16.14 or above:
    - When installing Node.js, you are recommended to check all checkboxes related to dependencies.
- RPC endpoint for the chain you want to index
- MongoDB databasectory and run the commands specified in the Readme Docs.
# Quick Start

```bash
npm install evmindex
#or
yarn add evmindex
#or
pnpm add evmindex
```

## Configuration
To set up the configuration file for EVMIndex, please refer to the sample configuration file available [here](/config.md).

## Running EVMIndex
Initialize the EVMIndex instance with the configuration file path and start the indexer.

```typescript
import EVMIndex from 'evmindex';

EVMIndex.init({
    mongoUri: '<mongodb uri>',
    configFilePath: join(__dirname, '../config.yaml'),
    providerUrl: '<RPC url>',
    ABIPath: `${__dirname}/abis`,
    handlerPath: `${__dirname}/handlers`
})
```
