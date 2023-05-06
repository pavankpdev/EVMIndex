import { ethers } from 'ethers'
import { Provider } from '@/config/provider'
import {Contract, HandlerFn, Listener} from '@/types'
import Transfers from '@/db/models/Transfers'
import axios from 'axios'

export async function removeAllListeners(listeners: Listener[]) {
    for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i]
        const { contract, events } = listener
        events.forEach((event) => {
            const eventFilter = contract.filters[event.event]()
            console.log(`Removing Listener for "${event.event}" on ${listener.address}`)
            contract.off(eventFilter, async (...args: unknown[]) => {
                await (event as {handler: HandlerFn}).handler(args);
                // TODO: Call webhook here
            })
        })
    }
}
