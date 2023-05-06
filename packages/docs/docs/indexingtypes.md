---
sidebar_position: 4
---

# Types of Indexing

### Indexing Past Logs
When the Indexer is started using the `--index-past-logs` argument, it will begin indexing all the previous logs for the contracts mentioned in the configuration file from the specified start block.
It is recommended to provide the closest start block value to avoid overburdening the RPC connection. This approach ensures that the process of indexing past logs is efficient and does not strain the RPC connection.
Unless you're using a premium RPC or a self-hosted node, it is recommended to use a start block value that is not too far in the past.

### Indexing Live Logs
When the Indexer is started using the `--index-live` argument, it will begin indexing all the live logs for the contracts mentioned in the configuration file from the current block.

### Indexing Past and Live Logs
When the Indexer is started using the `--index-all` argument, it will begin indexing all the past logs and live logs for the contracts mentioned in the configuration file from the specified start block.

