import { ethers } from 'ethers'
import { Provider } from '@/config/provider'
import { Contract } from '@/types'

export async function getNftTransferLogs(contracts: Contract[]) {
  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i]
    const { address, abi, startBlock, topic, model, primaryProperty } = contract
    if (!topic) throw new Error('Topic is required for indexing Past Logs')
    if (!primaryProperty) throw new Error('Primary property is required for indexing Past Logs')
    if (!model) throw new Error('Model is required for indexing Past Logs')
    if(!startBlock) throw new Error('Start block is required for indexing Past Logs')

    const filter = {
      address,
      fromBlock: startBlock,
      toBlock: 'latest',
      topics: [ethers.utils.id(topic), null, null],
    }
    const contractInstance = new ethers.Contract(address, abi, Provider)

    const logs = await Provider.getLogs(filter)
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i]
      const event = contractInstance.interface.parseLog(log)
      const transfer: Record<string, string | number> = {
        from: event.args[0],
        to: event.args[1],
        tokenId: event.args[2].toString(),
        blockNumber: log.blockNumber,
        txHash: log.transactionHash,
        contract: address,
      }

      const dbFilter: Record<string, string | number> = {}
      for (let i = 0; i < primaryProperty.length; i++) {
        const key: string = primaryProperty[i]
        dbFilter[key] = transfer[key]
      }

      await model.findOneAndUpdate(
          dbFilter,
          {
            $set: transfer,
          },
          {
            upsert: true,
          }
      );
    }
  }
}
