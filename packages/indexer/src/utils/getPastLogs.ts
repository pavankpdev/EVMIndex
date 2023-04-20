import { ethers } from 'ethers'
import { Provider } from '@/config/provider'
import Transfers from '@/db/models/Transfers'
import { Contract } from '@/types'

export async function getNftTransferLogs(contracts: Contract[]) {
  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i]
    const { address, abi, startBlock, topic } = contract
    if (!topic) throw new Error('Topic is required for indexing Past Logs')

    const filter = {
      address,
      fromBlock: startBlock,
      toBlock: 'latest',
      topics: [ethers.utils.id(topic), null, null],
    }
    const contractInstance = new ethers.Contract(address, abi, Provider)

    const logs = await Provider.getLogs(filter)
    const transfers = logs.map((log) => {
      const event = contractInstance.interface.parseLog(log)
      return {
        from: event.args[0],
        to: event.args[1],
        tokenId: event.args[2].toString(),
        blockNumber: log.blockNumber,
        txHash: log.transactionHash,
        contract: address,
      }
    })

    await Transfers.insertMany(transfers)
  }
}
