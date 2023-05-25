import dotenv from 'dotenv'
import * as process from 'node:process'
import * as readline from "readline";
import fs from "fs/promises";
import {join} from "path";
import yaml from "js-yaml";
import nc from 'node-cron'

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

  // console.log(await verifyConfirmations('0xc6d5f39469588724f15bfc74fd9858fbc787fd65fc2735d92bc8c95495ab580b', 100));

  // await connectToDB()
  // console.log('Connected to DB')

  }


run()

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
