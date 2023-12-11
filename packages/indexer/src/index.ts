import "fake-indexeddb/auto";
import {decodeEventLog, DecodeEventLogReturnType, Log} from "viem";
import {LiveIndexer} from "@/lib/indexer/live";
import {PastIndexer} from "@/lib/indexer/past";
export class EVMIndex {

    private rpc: string;
    constructor(
        rpc: string
    ) {
        this.rpc = rpc;
    }

    public async addLiveSync(
        address: `0x${string}`,
        event: string,
        callback: (logs: Log[]) => void
    ): Promise<void> {
        try {
            const liveIndexer = new LiveIndexer(this.rpc);
            console.log(`[Live Sync] Indexing ${address} for ${event} events`);
            await liveIndexer.watchEvent(address, event, callback)
            return;
        } catch (e: unknown) {
            console.log(`[Live Sync] Failed to index ${address} for ${event} events`);
            console.log(e);
        }
    }

    public async syncPastLogs(
        address: `0x${string}`,
        event: string,
    ): Promise<Log[] | undefined> {
        try {
            const pastIndexer = new PastIndexer(this.rpc);
            console.log(`[Past Sync] Indexing ${address} for ${event} events`);
            return pastIndexer.getPastLogs({
                address,
                event,
                fromBlock: 32228054,
                toBlock: 43432175
            })
        } catch (e: unknown) {
            console.log(`[Past Sync] Failed to index ${address} for ${event} events`);
            console.log(e);
        }
    }

    static decodeEventLogs(
        abi: any,
        logs: Log[]
    ): (Log & DecodeEventLogReturnType)[] {
        return logs.map((log) => {
            return {
                ...log,
                ...decodeEventLog({
                    abi,
                    data: log.data,
                    topics: log.topics
                })
            }
        })
    }

}
