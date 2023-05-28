import dotenv from 'dotenv'
import * as process from 'node:process'
import * as readline from "readline";
import fs from "fs/promises";
import {join} from "path";
import yaml from "js-yaml";
import {Worker} from 'worker_threads'

// MODELS
import { connectToDB } from '@/db/connect'

// CONFIG
import {Provider} from "@/config/provider";

// UTILS
import { setupListeners } from '@/utils/setupListeners'
import { indexTypes } from '@/utils/indexTypes'
import { throwInvalidCmdErr } from '@/utils/throwInvalidCmdErr'
import {removeAllListeners} from "@/utils/removeAllListeners";
import {prepareContract} from "@/utils/prepareContract";

import {Config} from "./types/index";
import {verifyConfirmations} from "@/utils/verifyConfirmations";
import {getBlockMiningTime} from "@/utils/getBlockMiningTime";
import {timeTakingFunction} from "@/worker";


dotenv.config()

const args = process.argv.slice(2)

const run = async () => {
  if (!args.length || !args[0]) {
    throwInvalidCmdErr()
  }
  if (!Object.values(indexTypes).some((key) => key === args[0])) {
    throwInvalidCmdErr(args[0])
  }

  const fileContents = await fs.readFile(join(__dirname, '../config.yaml'), 'utf8');
  const configs = yaml.load(fileContents) as Config

  const blockMiningTime = await getBlockMiningTime(Provider, 100)

  const listeners = prepareContract(configs.config)
  await setupListeners(listeners, blockMiningTime)

  await connectToDB()
  console.log('Connected to DB')

  }

// run()
//
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
//
// rl.on('SIGINT', async() => {
//   console.log('SIGINT received');
//   const fileContents = await fs.readFile(join(__dirname, '../config.yaml'), 'utf8');
//   const configs = yaml.load(fileContents) as Config
//
//   const listeners = prepareContract(configs.config)
//   removeAllListeners(listeners)
//       .finally(() => {
//     process.exit();
//   })
//   process.exit();
// });

const worker = new Worker(`${__dirname}/__worker.js`, {
    workerData: {
      path: `${__dirname}/worker.ts`
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
    console.log(exitCode);
  console.log("Executed in the main thread");
})

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