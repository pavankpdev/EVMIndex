import { parentPort, workerData } from  "worker_threads";
import fs from "fs/promises";
import {join} from "path";
import yaml from "js-yaml";
import {Config} from "./types";
import {getBlockMiningTime} from "./utils/getBlockMiningTime";
import {Provider} from "./config/provider";
import {prepareContract} from "./utils/prepareContract";
import {setupListeners} from "./utils/setupListeners";
import {connectToDB} from "./db/connect";

const run = async () => {

    const fileContents = await fs.readFile(workerData?.configFilePath, 'utf8');
    const configs = yaml.load(fileContents) as Config

    const blockMiningTime = await getBlockMiningTime(Provider, 100)

    const listeners = prepareContract(configs.config)
    await setupListeners(listeners, blockMiningTime)

    await connectToDB(workerData?.mongoURI)
    console.log('Connected to DB')

}

export const timeTakingFunction = () => {
    run();
    return "EVMIndex running in background"
};

if(parentPort)
    parentPort.postMessage(timeTakingFunction());
