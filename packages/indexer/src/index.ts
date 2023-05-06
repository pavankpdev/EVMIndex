import dotenv from 'dotenv'
import * as process from 'node:process'
import * as readline from "readline";
import fs from "fs/promises";
import {join} from "path";
import yaml from "js-yaml";

// CONFIGS
import { setup } from '@/setup'
import { connectToDB } from '@/db/connect'

// MODELS
import { setupListeners } from '@/utils/setupListeners'
import { indexTypes } from '@/utils/indexTypes'
import { getNftTransferLogs } from '@/utils/getPastLogs'
import { throwInvalidCmdErr } from '@/utils/throwInvalidCmdErr'
import {removeAllListeners} from "@/utils/removeAllListeners";
import {Config} from "./types/index";
import {prepareContract} from "@/utils/prepareContract";

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

  const listeners = prepareContract(configs.config)
  await setupListeners(listeners)

  // await connectToDB()
  // console.log('Connected to DB')
  //
  // if (
  //   args[0] === indexTypes['index-past-logs'] ||
  //   args[0] === indexTypes['index-all']
  // ) {
  //   await getNftTransferLogs(setup.contracts)
  // }
  //
  // if (
  //   args[0] === indexTypes['index-live'] ||
  //   args[0] === indexTypes['index-all']
  // ) {
  //   await setupListeners(setup.contracts)
  // }
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
