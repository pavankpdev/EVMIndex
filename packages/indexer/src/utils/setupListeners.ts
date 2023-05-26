import nc from 'node-cron'
import {HandlerFn, Listener} from '@/types'
import {callWebhook} from "@/utils/callWebhook";
import {convertSecondsToCron} from "@/utils/convertSecondsToCron";
import Jobs from "@/db/models/Jobs";
import {verifyConfirmations} from "@/utils/verifyConfirmations";
import {cronJobHandler} from "@/utils/cronJobHandler";

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

        console.log((args.reverse()[0] as {transactionHash: string})?.transactionHash)

        // TODO: save txn hash to DB
        await Jobs.create({
          txHash: `${(args.reverse()[0] as {transactionHash: string})?.transactionHash}`,
        })

        const cronJobParams = {
            args,
            event,
            confirmations: updatedFilter.confirmations,
            hash: (args.reverse()[0] as {transactionHash: string})?.transactionHash
        }

        const job = nc.schedule(cron, async () => {
          await cronJobHandler(cronJobParams)
          job.stop();
        })
      })
    })
  }
}

