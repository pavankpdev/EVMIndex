import type {Contract, EventHandler} from "../types/index";
import {Provider} from "@/config/provider";
import {ethers} from "ethers";
import {Listener} from "@/types";
import * as generated from "@/types/generated";

export const prepareContract = (config: Contract[]): Listener[] => {
    return config.map((contract) => {
        const { source, entities, eventHandlers } = contract
        const ABI = require(`@/abis/${source.abi}.json`)

        if(eventHandlers.length !== entities.length)
            throw new Error('The number of event handlers and entities are not equal');

        return {
            contract: new ethers.Contract(source.address, ABI, Provider),
            address: source.address,
            events: eventHandlers.map((eventHandler: EventHandler, i): EventHandler => {
                const CTX: unknown = generated[entities[i] as keyof typeof generated];
                return {
                    event: eventHandler.event,
                    handler: async (ctx: typeof CTX) => {console.log(ctx)},
                    webhook: eventHandler?.webhook,
                }
            })
        }
    })
}