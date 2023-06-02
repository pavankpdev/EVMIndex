---
sidebar_position: 2
---

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

That's it! You're all set to start using EVMIndex. 
