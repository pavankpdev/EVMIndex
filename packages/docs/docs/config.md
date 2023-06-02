---
sidebar_position: 5
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
    entities:
      - "<Event Name 1>"
    eventHandlers:
      - event: "<event topic>"
        handler: "<handler function name>"
        file: "<handler function file path>"
        webhook: "<webhook URL> - Optional but make sure CORS is enabled. "
        confirmations: any number between 1 and 100
```
The provided YAML code represents a configuration file structure used for defining contracts, entities, and event handlers. Here's a summary of the code:

Each contract in the configuration has the following properties:
- `name`: Specifies the name of the contract.
- `source`: Contains information about the contract's source, including the address and the ABI filename.

Additionally, contracts can have associated entities and event handlers. The `entities` property is an array that lists the names of the events to be tracked for the contract. 

The `eventHandlers` property is another array that defines the event handlers for specific entity. Each event handler consists of the following properties:
- `event`: Specifies the topic of the event.
- `handler`: Indicates the name of the function that will handle the event.
- `file`: Specifies the file path where the handler function is defined.
- `webhook`: An optional webhook URL can be provided for handling the event, with CORS considerations in mind.
- `confirmations`: A confirmation count is a required number between 1 and 100 that specifies the number of confirmations for an event.

This configuration file allows for defining multiple contracts, associating entities and event handlers with them, and providing the necessary information for handling events emitted by these contracts.

### Example
```yaml
config:
  - name: Meka
    source:
      address: "0x147923c03Ee14c65eaE13398926E35eA553cEA98"
      abi: Meka
    entities:
      - Transfer
    eventHandlers:
      - event: Transfer(address,address,uint256)
        handler: handleTransfer
        file: meka/index.ts
        confirmations: 100
        webhook: https://webhook.site/1vrdc8801-2e59-4c47-9c1f-7eb04207a05e
```