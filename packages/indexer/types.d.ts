export type InitOptions = {
  mongoUri: string
  configFilePath: string
  providerUrl: string
  ABIPath: string
  handlerPath: string
}

import { Contract as EthersContract } from 'ethers'

export type HandlerFn = (ctx: unknown) => Promise<void>

export type EventHandler = {
  event: string
  handler: string | HandlerFn
  webhook?: string
  file: string
  confirmations?: number
  eventArgs: string[]
}

export type Contract = {
  name: string
  source: {
    address: string
    startBlock: number | string
    abi: string
  }
  entities: string[]
  eventHandlers: EventHandler[]
}

export type Config = {
  config: Contract[]
}

export type Listener = {
  contract: EthersContract
  address: string
  events: Omit<EventHandler, 'file'>[]
}
