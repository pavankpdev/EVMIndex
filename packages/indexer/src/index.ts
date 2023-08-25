import "fake-indexeddb/auto";
import {z} from 'zod'
import {Worker} from 'worker_threads'
import { v4 as uuidv4 } from 'uuid';

// DB
import {connectToDB} from "./db/connect";

// VALIDATIONS
import {registerContractSchema} from "@/validations/registerContract";
import {RxDatabase} from "rxdb";
import {getContractCollection} from "@/db/models/Contract";

class EVMIndex {

    private dbConnection: RxDatabase | undefined;

    constructor() {
        connectToDB().then((d) => {
            console.log(d)
            this.dbConnection = d;
        })
    }

    public async registerContract(options: z.infer<typeof registerContractSchema>): Promise<void> {
        try {

            if(!this.dbConnection) {
                throw new Error("DB not connected")
            }

            registerContractSchema.parse(options)

            const collection = await getContractCollection(this.dbConnection);
            await collection.contracts.insert({
                id: uuidv4(),
                ...options
            });

            const worker = new Worker(`${__dirname}/__worker.js`, {
                workerData: {
                    path: `${__dirname}/__worker.js`
                }
            });

            console.log(worker)

            worker.on( "message", (result) => {
                console.log(result);
            });

            // Listen for uncaught exceptions from the worker thread
            worker.on( "error" , (error) => {
                console.log(error);
            });

            // Listen for the exit event
            worker.on("exit", async (exitCode) => {
                console.log(`Worker stopped with exit code ${exitCode}`);
            });

        } catch (e: unknown) {
            console.error(e)
        }
    }
}

const main = () => {
    const evmIndex = new EVMIndex();
    evmIndex.registerContract({
        name: "Test",
        address: "0x123",
        abi: [{}],
        startBlock: 123,
        webhooks: ["https://webhook.site/"],
    })
}

main();