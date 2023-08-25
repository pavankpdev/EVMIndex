import {Contract as EthersContract} from "ethers";

export type HandlerFn = (ctx: unknown) => Promise<void>

export type EventHandler = {
    event: string,
    handler: string | HandlerFn,
    webhook?: string,
    file: string,
    confirmations?: number,
    eventArgs: string[]
}

export type ContractOptions = {
    name: string,
    address: string
    abi: string
}

export type RegisterContractOptions = ContractOptions & {
    startBlock: number | string,
    webhooks?: string | string[],
    handlers?: (param: unknown) => void,
}

export type Config = {
    config: ContractOptions[]
}


export type Listener = {
    contract: EthersContract,
    address: string,
    events: Omit<EventHandler, "file">[]
}