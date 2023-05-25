import nc from 'node-cron'
import {HandlerFn, Listener} from '@/types'
import {callWebhook} from "@/utils/callWebhook";
import {convertSecondsToCron} from "@/utils/convertSecondsToCron";

const DEFAULT_CONFIRMATIONS = 5;

export async function setupListeners(listeners: Listener[], blockMiningTime: number) {
  for (let i = 0; i < listeners.length; i++) {
    const listener = listeners[i]
    const { contract, events } = listener
    events.forEach((event) => {
      const eventFilter = contract.filters[event.event]()
      const updatedFilter = { ...eventFilter, confirmations: event.confirmations || DEFAULT_CONFIRMATIONS };
      console.log(`Listening for "${event.event}" on ${listener.address}`)
      contract.on(updatedFilter, async (...args: unknown[]) => {
        const timeRequired = blockMiningTime * updatedFilter.confirmations;
        const cron = convertSecondsToCron(timeRequired);

        const job = nc.schedule(cron, async () => {
          // TODO: Check for confirmations, if confirmed call webhook and handler, else, save it somewhere else
          // TODO: calculate no of params of the event
          const txnHash = (args[3] as {transactionHash: string})?.transactionHash;
          console.log(`Transaction ${txnHash} confirmed!`)
          job.stop();
        })
        await (event as {handler: HandlerFn}).handler(args);
        if(event?.webhook) {
           await callWebhook(event.webhook, args)
        }
      })
    })
  }
}

