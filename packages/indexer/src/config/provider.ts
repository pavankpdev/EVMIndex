import { ethers } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()
export const Provider = new ethers.providers.JsonRpcProvider(
  process.env.RPC_URL
)
