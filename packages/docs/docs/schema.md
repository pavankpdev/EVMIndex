---
sidebar_position: 6
---

# Schema
EVMIndex offers the capability to define a schema for the data that needs to be indexed. This schema, written in GraphQL, serves as the foundation for generating the required TypeScript types and MongoDB schema for the indexer. 
In the `config.yaml` file, the `entities` field should align with the names of the types specified in the schema file.

It's important to note that EVMIndex currently supports custom scalar types such as `Bytes` and `BigInt`. These scalar types can be utilized within the schema to accommodate specific data requirements.

### Example
```graphql
scalar Bytes
scalar BigInt

type Approval {
  id: Bytes
  owner: Bytes! # address
  approved: Bytes! # address
  tokenId: BigInt! # uint256
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type Transfer {
  id: Bytes
  owner: Bytes! # address
  approved: Bytes! # address
  tokenId: BigInt! # uint256
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}

type Query {
  _required_do_not_remove: Boolean
}
```


