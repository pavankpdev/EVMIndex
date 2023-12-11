import {Provider} from "../provider";
import {Log, parseAbiItem, WatchEventReturnType} from "viem";

export class LiveIndexer extends Provider {

    private eventWatchers: Record<string, WatchEventReturnType> = {};

    constructor(rpc: string) {
        super(rpc);
    }

    public async watchEvent(
        address: `0x${string}`,
        event: string,
        logsHandler: (logs: Log[]) => void
    ) {
        this.eventWatchers[`${address}-${event}`] = this.getClient().watchEvent({
            address,
            onLogs: logsHandler,
            // @ts-ignore
            event: parseAbiItem(event),
        });
    }

}