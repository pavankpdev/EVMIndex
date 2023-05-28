import {verifyConfirmations} from "../utils/verifyConfirmations";
import {EventHandler, HandlerFn} from "../types";
import {callWebhook} from "../utils/callWebhook";
import Jobs from "../db/models/Jobs";
import nc from "node-cron";
import {convertSecondsToCron} from "../utils/convertSecondsToCron";

type Params = {
    args: unknown[],
    event: Omit<EventHandler, "file">,
    confirmations: number,
    hash: string,
    blockMiningTime: number
}

export const cronJobHandler = async (params: Params) => {

    const {hash, confirmations, args, event, blockMiningTime} = params;

    const {status, confirmation: currentConfirmation} = await verifyConfirmations(hash, confirmations);
    if(status) {
        let params: Record<string, any> = {}
        event.eventArgs.map((ea, i) => {
            params[ea] = args[i]
        })
        const txn = args.reverse()[0];
        await (event as {handler: HandlerFn}).handler({...params, txn});
        if(event?.webhook) {
            await callWebhook(event.webhook, args)
        }

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
        const currentJob = await Jobs.findOne({txHash: hash})
        if(currentJob && currentJob?.retries <=3) {
            console.log(`Transaction ${args[3]} not confirmed yet, retrying for ${hash}, retry count: ${currentJob.retries + 1}`)
            await Jobs.findOneAndUpdate(
                {
                    txHash: hash
                },
                {
                    $set: {
                        retries: currentJob.retries + 1
                    }
                }
            )

            const timeRequired = blockMiningTime * (confirmations - currentConfirmation);
            const cron = convertSecondsToCron(timeRequired);

            const job = await nc.schedule(cron, async () => {
                await cronJobHandler(params)
                job.stop();
            })
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
    }
}