import {z} from "zod";

export const registerContractSchema = z.object({
    name: z.string(),
    address: z.string(),
    abi: z.array(z.any()),
    startBlock: z.number(),
    webhooks: z.array(z.string()).optional(),
    handlers: z.function().optional(),
})