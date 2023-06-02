---
sidebar_position: 7
---

# Limitations

Before utilizing EVM Index, it's important to consider the following limitations:

### RPC Restrictions
EVM Index relies on the RPC endpoint to index data from the chain. If the RPC endpoint imposes restrictions on the number of requests, it may hinder the Indexer's ability to index all the data, potentially resulting in missing information. One way to address this is by using a dedicated/premium RPC endpoint or a dedicated node.

### Indexing Speed
While the Indexer is designed to be efficient and lightweight, the speed of indexing is still influenced by the RPC endpoint and the underlying infrastructure provided. It's essential to consider these factors while managing expectations regarding indexing performance.

### Limited to EVM Chains
EVM Index is specifically tailored to index EVM chains and does not offer support for other chains like Substrate, Solana, etc. The focus is currently on EVM chains. However, efforts are underway to introduce support for additional chains in the future.

  