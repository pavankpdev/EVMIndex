import * as process from 'node:process'
import * as readline from "readline";
import fs from "fs/promises";
import {join} from "path";
import yaml from "js-yaml";
import {Worker} from 'worker_threads'

import {removeAllListeners} from "./utils/removeAllListeners";
import {prepareContract} from "./utils/prepareContract";

import {Config} from "./types/index";
import {InitOptions} from "../types";

const init = (initOptions: InitOptions) => {

    if(Object.values(initOptions).some(value => !value)) {
        throw new Error('Invalid initialization options')
    }

    const worker = new Worker(`${__dirname}/__worker.js`, {
        workerData: {
            path: `${__dirname}/worker.js`,
            mongoURI: initOptions.mongoUri,
            configFilePath: initOptions.configFilePath,
            providerURL: initOptions.providerUrl,
            ABIPath: initOptions.ABIPath,
            handlerPath: initOptions.handlerPath
        }
    });

// Listen to messages from the worker thread
    worker.once( "message", (result) => {
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
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('SIGINT', async() => {
    console.log('SIGINT received');
    const fileContents = await fs.readFile(join(__dirname, '../config.yaml'), 'utf8');
    const configs = yaml.load(fileContents) as Config

    const listeners = prepareContract(configs.config)
    removeAllListeners(listeners)
        .finally(() => {
            process.exit();
        })
    process.exit();
});

export default {
    init
};