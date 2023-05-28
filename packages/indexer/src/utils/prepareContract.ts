import type {Contract, EventHandler} from "../types/index";
import {Provider} from "../config/provider";
import {ethers} from "ethers";
import {Listener} from "../types";

export const prepareContract = (config: Contract[]): Listener[] => {
    return config.map((contract) => {
        const { source, entities, eventHandlers } = contract
        const ABI = require(`../abis/${source.abi}.json`)

        if(eventHandlers.length !== entities.length)
            throw new Error('The number of event handlers and entities are not equal');

        return {
            contract: new ethers.Contract(source.address, ABI, Provider),
            address: source.address,
            events: eventHandlers.map((eventHandler: EventHandler, i): EventHandler => {
                const entityType = entities[i];

                const ABI = require(`../abis/${contract.source.abi}.json`)
                const event = ABI.find((e: Record<string, string>) => e.name === entityType);

                if(!event) throw new Error(`Event ${entityType} not found in ABI`);

                const eventInputs = event.inputs.map((input: Record<string, string>) => input.name);

                const handler: Record<string, any> = require(`../${eventHandler.file}`);
                return {
                    event: eventHandler.event,
                    handler: async (ctx: any) => handler[eventHandler.handler as string](ctx),
                    webhook: eventHandler?.webhook,
                    file: eventHandler.file,
                    confirmations: eventHandler?.confirmations,
                    eventArgs: eventInputs
                }
            })
        }
    })
}