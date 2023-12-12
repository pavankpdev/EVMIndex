import { Provider } from '../../lib/provider'
import { Log, parseAbiItem } from 'viem'
import { PastLogsParams } from '../../types'
import {PAST_SYNC_BLOCK_LIMIT} from "@/utils/constants";
import {sleep} from "@/utils/sleep";

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

    const totalBlocksToScan = toBlock - fromBlock
    const requests = Math.ceil(totalBlocksToScan / PAST_SYNC_BLOCK_LIMIT)
    console.log({requests})

    const logs: Log[] = []

    for (let i = 0; i < requests; i++) {
      const from = fromBlock + i * PAST_SYNC_BLOCK_LIMIT
      const to = Math.min(fromBlock + (i + 1) * PAST_SYNC_BLOCK_LIMIT, toBlock)
      console.log(from, to)

      const logsChunk = await this.getClient().getLogs({
        address,
        event: parseAbiItem(event) as any,
        fromBlock: BigInt(from),
        toBlock: BigInt(to),
      })
      logs.push(...logsChunk)
      console.log(`=====================`)
      console.log(`[Past Sync] Synced ${logs.length} logs`)
      console.log(`[Past Sync] ${requests - i} requests left`)
      await sleep(60000) // sleep for a minute
    }

    return logs
  }
}
