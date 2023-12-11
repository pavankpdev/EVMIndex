import { ethers } from 'ethers'
import dotenv from 'dotenv'
import { workerData } from 'worker_threads'

dotenv.config()
export const Provider = new ethers.providers.JsonRpcProvider(
  workerData?.providerURL
)
