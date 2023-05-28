import { parentPort, workerData } from  "worker_threads";
import dotenv from "dotenv";
import process from "node:process";
import {throwInvalidCmdErr} from "./utils/throwInvalidCmdErr";
import {indexTypes} from "./utils/indexTypes";
import fs from "fs/promises";
import {join} from "path";
import yaml from "js-yaml";
import {Config} from "./types";
import {getBlockMiningTime} from "./utils/getBlockMiningTime";
import {Provider} from "./config/provider";
import {prepareContract} from "./utils/prepareContract";
import {setupListeners} from "./utils/setupListeners";
import {connectToDB} from "./db/connect";
import readline from "readline";
import {removeAllListeners} from "./utils/removeAllListeners";

dotenv.config()

const args = process.argv.slice(2)

const run = async () => {

    const fileContents = await fs.readFile(join(__dirname, '../config.yaml'), 'utf8');
    const configs = yaml.load(fileContents) as Config

    const blockMiningTime = await getBlockMiningTime(Provider, 100)

    const listeners = prepareContract(configs.config)
    await setupListeners(listeners, blockMiningTime)

    await connectToDB()
    console.log('Connected to DB')

}

export const timeTakingFunction = () => {
    run();
    return "EVMIndex running in background"
};

if(parentPort)
    parentPort.postMessage(timeTakingFunction());
