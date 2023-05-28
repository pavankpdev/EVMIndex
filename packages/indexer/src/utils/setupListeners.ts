import nc from 'node-cron'
import {Listener} from '@/types'
import {convertSecondsToCron} from "@/utils/convertSecondsToCron";
import Jobs from "@/db/models/Jobs";
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

        const txHash = (args.reverse()[0] as {transactionHash: string})?.transactionHash

        await Jobs.create({
          txHash,
        })

        const cronJobParams = {
            args,
            event,
            confirmations: updatedFilter.confirmations,
            hash: txHash,
          blockMiningTime
        }

        const job = nc.schedule(cron, async () => {
          await cronJobHandler(cronJobParams)
          job.stop();
        })
      })
    })
  }
}

