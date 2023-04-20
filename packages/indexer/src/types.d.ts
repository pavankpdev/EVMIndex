export type Contract = {
  name: string
  address: string
  startBlock: number
  abi: Record<string, unknown>[]
  events: string[]
  topic?: string
}
