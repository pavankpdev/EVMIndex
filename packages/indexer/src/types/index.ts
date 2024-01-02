import { Log } from 'viem'

export type ContractOptions = {
  name: string
  address: string
  abi: string
}

export type RegisterContractOptions = ContractOptions & {
  startBlock: number | string
  webhooks?: string | string[]
  handlers?: (param: unknown) => void
}

export type Config = {
  config: ContractOptions[]
}

export type PastLogsParams = {
  address: `0x${string}`
  event: string
  fromBlock: number
  toBlock: number
  cb?: (logs: Log[]) => void
}
