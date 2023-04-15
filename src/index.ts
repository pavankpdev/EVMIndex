import dotenv from 'dotenv'

// CONFIGS
import { Provider } from '@/config/provider'

dotenv.config()

Provider?.detectNetwork().then((network) => {
  console.log(`The chain ID is ${network.chainId}`)
})

Provider.getBlockNumber().then((blockNumber) => {
  console.log(`The Current Block is ${blockNumber}`)
})
