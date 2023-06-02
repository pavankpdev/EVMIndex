---
sidebar_position: 3
---

# How it works? 
EVMIndex follows a simple and efficient approach to index data from EVM chains. Here's an overview of how it works:

![Building the indexer](https://dbaugbrwob9sy.cloudfront.net/How+it+works.png)

- Contract events are emitted and picked up by the EVMIndex.
- The indexer parses the events and schedules a CRON job for confirmation checks.
- The confirmation count, specified in the config file, determines the number of confirmations required (up to a limit of 100).
- If the confirmation check is successful, the webhook and handler are triggered to handle the event.
- In case of failure, the confirmation check is retried up to three times before marking it as a failure.

## What EVMIndex doesn't do?

EVMIndex has a selective approach to block parsing in order to optimize resource utilization and avoid exhausting the RPC. 
It is designed to index a specific set of contracts rather than parsing every block on the chain. 
This strategy helps in reducing costs and ensuring efficient performance, especially considering that EVMIndex is self-hosted. By focusing on the specified contracts, EVMIndex efficiently indexes the relevant data without overwhelming the system with unnecessary processing.
