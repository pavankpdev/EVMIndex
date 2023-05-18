import {HandlerFn, Listener} from '@/types'
import {callWebhook} from "@/utils/callWebhook";

const DEFAULT_CONFIRMATIONS = 5;

export async function setupListeners(listeners: Listener[]) {
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i]
    const { contract, events } = listener
    events.forEach((event) => {
      const eventFilter = contract.filters[event.event]()
      const updatedFilter = { ...eventFilter, confirmations: event.confirmations || DEFAULT_CONFIRMATIONS };
      console.log(`Listening for "${event.event}" on ${listener.address}`)
      contract.on(updatedFilter, async (...args: unknown[]) => {
        await (event as {handler: HandlerFn}).handler(args);
        if(event?.webhook) {
           await callWebhook(event.webhook, args)
        }
      })
    })
  }
}

