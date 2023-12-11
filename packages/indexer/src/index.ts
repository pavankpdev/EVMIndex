import "fake-indexeddb/auto";
import {LiveIndexer} from "@/lib/indexer/live";
import {Log} from "viem";
export class EVMIndex extends LiveIndexer {
    constructor(
        rpc: string
    ) {
        super(rpc);
    }

    public async addLiveSync(
        address: `0x${string}`,
        event: string,
        callback: (logs: Log[]) => void
    ): Promise<void> {
        try {
            console.log(`[Live Sync] Indexing ${address} for ${event} events`);
            await this.watchEvent(address, event, callback)
            return;
        } catch (e: unknown) {
            console.log(`[Live Sync] Failed to index ${address} for ${event} events`);
            console.log(e);
        }
    }

}
