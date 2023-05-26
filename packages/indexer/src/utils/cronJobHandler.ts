import {verifyConfirmations} from "@/utils/verifyConfirmations";
import {EventHandler, HandlerFn} from "@/types";
import {callWebhook} from "@/utils/callWebhook";
import Jobs from "@/db/models/Jobs";

type Params = {
    args: unknown[],
    event: Omit<EventHandler, "file">,
    confirmations: number,
    hash: string
}

export const cronJobHandler = async (params: Params) => {

    const {hash, confirmations, args, event} = params;

    const confirmationStatus = await verifyConfirmations(hash, confirmations);
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

        console.log(`Transaction ${hash} confirmed!`)
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
        // TODO: recursively check for confirmation, retry upto 3 times
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