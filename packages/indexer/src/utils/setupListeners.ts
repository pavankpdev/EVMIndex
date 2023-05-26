import nc from 'node-cron'
import {HandlerFn, Listener} from '@/types'
import {callWebhook} from "@/utils/callWebhook";
import {convertSecondsToCron} from "@/utils/convertSecondsToCron";
import Jobs from "@/db/models/Jobs";
import {verifyConfirmations} from "@/utils/verifyConfirmations";

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

        const job = nc.schedule(cron, async () => {
          const hash = (args.reverse()[0] as {transactionHash: string}).transactionHash;
          // TODO: Check for confirmations, if confirmed call webhook and handler, else, save it somewhere else
          const confirmationStatus = await verifyConfirmations(hash, updatedFilter.confirmations);
          // TODO: calculate no of params of the event
          if(confirmationStatus) {
            let params: Record<string, any> = {}
            event.eventArgs.map((ea, i) => {
              params[ea] = args[i]
            })
            const txn = args.reverse()[0];
            await (event as {handler: HandlerFn}).handler({...params, txn});
            if(event?.webhook) {
              await callWebhook(event.webhook, args)
            }

            const txnHash = (args[3] as {transactionHash: string})?.transactionHash;
            console.log(`Transaction ${txnHash} confirmed!`)
            await Jobs.findOne(
                {
                  txHash: hash
                },
                {
                  $set: {
                    processed: true
                  }
                }
            )
          } else {
            console.log(`Transaction ${args[3]} not confirmed yet, manual check required for ${hash}`)
            await Jobs.findOne(
                {
                  txHash: hash
                },
                {
                  $set: {
                    errored: true
                  }
                }
            )
          }
          job.stop();
        })
      })
    })
  }
}

