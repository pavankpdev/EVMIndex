import {Mongoose} from "mongoose";
import {Transfer} from "@/db/models/Transfers";

export type Contract = {
  name: string
  address: string
  startBlock: number
  abi: Record<string, unknown>[]
  events: string[]
  topic?: string,
  model: Mongoose.Model<T, {}>,
  primaryProperty: Array<keyof Transfer>,
  webhook?: string
}
