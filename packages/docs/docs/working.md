---
sidebar_position: 5
---

# How it works? 
EVMIndex follows a simple and efficient approach to index data from EVM chains. Here's an overview of how it works:

### Define the schema
EVMIndex uses a schema defined in the `schema.graphql` file to specify the structure of the indexed data. 
The schema is written in GraphQL, allowing for flexible and precise data definition.
You can learn more about defining the schema [here](/docs/intro).

### Build the indexer
To generate the necessary TypeScript types and MongoDB schema for the defined schema, you need to build the indexer. Run the following command:

```bash
npm run build
# or
yarn build
#or
pnpm build
```
TThis command parses the schema file, checks for any errors, and generates the required types and schema. This step ensures that the necessary types are available when writing [handler functions](/docs/intro). 

### Write the handler functions
EVMIndex utilizes handler functions to process the indexed data. These functions can be written anywhere within the project, but it is recommended to follow the `handlers/<Contract>/<filename.ts>` pattern. 
Make sure to update these functions in the `config.yaml` file. **Note that the handler functions should have named exports and not default exports**.

### Define the config file
In the config.yaml file, define the contracts and events that you want to index. This configuration file specifies the contracts to monitor and the corresponding events to capture.
Learn more about the config file [here](/docs/config).

### Run the indexer 
Once the configuration is set, you can start the indexer in three different modes:

1. `--index-past-logs`: Indexes only past logs
2. `--index-live`: Indexes only live events
3. `--index-all`: Indexes both past logs and live events
4. 
To start the indexer, run the following command:

```bash
npm run dev --[type]
# or
yarn dev --[type]
#or
pnpm dev --[type]
```
Replace `[type]` with the desired indexing mode.

Refer to [Types of Indexing](/docs/indexingtypes) for more information on these modes and their functionalities.

### Congratulations
You have successfully set up and started using EVMIndex to index data from EVM chains.

## What EVMIndex doesn't do?

EVMIndex has a selective approach to block parsing in order to optimize resource utilization and avoid exhausting the RPC. 
It is designed to index a specific set of contracts rather than parsing every block on the chain. 
This strategy helps in reducing costs and ensuring efficient performance, especially considering that EVMIndex is self-hosted. By focusing on the specified contracts, EVMIndex efficiently indexes the relevant data without overwhelming the system with unnecessary processing.
