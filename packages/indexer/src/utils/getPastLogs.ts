import { ethers } from 'ethers'
import { Provider } from '@/config/provider'
import Transfers from '@/db/models/Transfers'
import { Contract } from '@/types'

export async function getNftTransferLogs(contracts: Contract[]) {
  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i]
    const { address, abi, startBlock, topic, model, primaryProperty } = contract
    if (!topic) throw new Error('Topic is required for indexing Past Logs')

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
      const transfer: Record<string, any> = {
        from: event.args[0],
        to: event.args[1],
        tokenId: event.args[2].toString(),
        blockNumber: log.blockNumber,
        txHash: log.transactionHash,
        contract: address,
      }

      const dbFilter: Record<string, any> = {}
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


    // await Transfers.insertMany(transfers)
  }
}
