import dotenv from 'dotenv'
import * as process from 'node:process'
import * as readline from "readline";
// CONFIGS
import { setup } from '@/setup'
import { connectToDB } from '@/db/connect'

// MODELS
import { setupListeners } from '@/utils/setupListeners'
import { indexTypes } from '@/utils/indexTypes'
import { getNftTransferLogs } from '@/utils/getPastLogs'
import { throwInvalidCmdErr } from '@/utils/throwInvalidCmdErr'
import {removeAllListeners} from "@/utils/removeAllListeners";

dotenv.config()

const args = process.argv.slice(2)

const run = async () => {
  if (!args.length || !args[0]) {
    throwInvalidCmdErr()
  }
  if (!Object.values(indexTypes).some((key) => key === args[0])) {
    throwInvalidCmdErr(args[0])
  }

  await connectToDB()
  console.log('Connected to DB')

  if (
    args[0] === indexTypes['index-past-logs'] ||
    args[0] === indexTypes['index-all']
  ) {
    await getNftTransferLogs(setup.contracts)
  }

  if (
    args[0] === indexTypes['index-live'] ||
    args[0] === indexTypes['index-all']
  ) {
    await setupListeners(setup.contracts)
  }
}


run()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('SIGINT', () => {
  console.log('SIGINT received');
  removeAllListeners(setup.contracts)
      .finally(() => {
    process.exit();
  })
});
