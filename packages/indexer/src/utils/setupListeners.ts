import {HandlerFn, Listener} from '@/types'


export async function setupListeners(listeners: Listener[]) {
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i]
    const { contract, events } = listener
    events.forEach((event) => {
      const eventFilter = contract.filters[event.event]()
      console.log(`Listening for "${event.event}" on ${listener.address}`)
      contract.on(eventFilter, async (...args: unknown[]) => {
        await (event as {handler: HandlerFn}).handler(args);
        // TODO: Call webhook here
      })
    })
  }
}

