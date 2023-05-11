---
sidebar_position: 4
---

# Configuration

EVMIndex follows a simple global configuration for your contracts and events.
You can configure your contracts and events in the `config.yaml` file.

### File Structure
```yaml
config:
  - name: "<contract name>"
    source:
      address: "<contract address>"
      abi: "<contract abi filename>"
      startBlock: "<number> - This is used for indexing past logs"
    entities:
      - "<Event Name 1>"
    eventHandlers:
      - event: "<event topic>"
        handler: "<handler function name>"
        file: "<handler function file path>"
        webhook: "<webhook URL> - Optional but make sure CORS is enabled. "
```
The provided YAML code represents a configuration file structure used for defining contracts, entities, and event handlers. Here's a summary of the code:

Each contract in the configuration has the following properties:
- `name`: Specifies the name of the contract.
- `source`: Contains information about the contract's source, including the address and the ABI filename.
- `startBlock`: Indicates the block number from which the contract's logs should be indexed. This is used for indexing past logs. 

Additionally, contracts can have associated entities and event handlers. The `entities` property is an array that lists the names of the events to be tracked for the contract. 
The entity name should be unique and should match with the types defined in the [schema](schema).

The `eventHandlers` property is another array that defines the event handlers for specific entity. Each event handler consists of the following properties:
- `event`: Specifies the topic of the event.
- `handler`: Indicates the name of the function that will handle the event.
- `file`: Specifies the file path where the handler function is defined.
- `webhook`: An optional webhook URL can be provided for handling the event, with CORS considerations in mind.

This configuration file allows for defining multiple contracts, associating entities and event handlers with them, and providing the necessary information for handling events emitted by these contracts.

### Example
```yaml
config:
  - name: Meka
    source:
      address: "0x147923c03Ee14c65eaE13398926E35eA553cEA98"
      abi: Meka
      startBlock: 32228054
    entities:
      - Transfer
      - Approval
    eventHandlers:
      - event: Transfer(address,address,uint256)
        handler: handleTransfer
        file: ./handlers/meka/index.ts
        webhook: https://webhook.site/a6dc8801-2e59-4c47-9c1f-7eb04207a05e
      - event: Approval(address,address,uint256)
        handler: handleApproval
        file: ./handlers/meka/index.ts
        webhook: https://webhook.site/1vrdc8801-2e59-4c47-9c1f-7eb04207a05e

```