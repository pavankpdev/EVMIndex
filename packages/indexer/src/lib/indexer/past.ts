import { Provider } from '@/lib/provider'
import { Log, parseAbiItem } from 'viem'

type PastLogsParams = {
  address: `0x${string}`
  event: string
  fromBlock: number
  toBlock: number
}

export class PastIndexer extends Provider {
  constructor(rpc: string) {
    super(rpc)
  }

  async getPastLogs(params: PastLogsParams): Promise<Log[] | undefined> {
    const { address, event, fromBlock, toBlock } = params

    if (fromBlock > toBlock) {
      throw new Error(`Invalid block range: ${fromBlock} > ${toBlock}`)
    }

    if (fromBlock < 0) {
      throw new Error(
        `Syncing from genesis block is not supported yet, please specify a block number greater than 0`
      )
    }

    return this.getClient().getLogs({
      address,
      event: parseAbiItem(event) as any,
      fromBlock: BigInt(fromBlock),
      toBlock: BigInt(toBlock),
    })
  }
}
