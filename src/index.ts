import dotenv from 'dotenv'
import { ethers } from 'ethers'

// CONFIGS
import { Provider } from '@/config/provider'
import { setup } from '@/setup'
import { connectToDB } from '@/db/connect'

// MODELS
import Transfers from '@/db/models/Transfers'

dotenv.config()

connectToDB().then(() => {
  console.log('Connected to DB')
})

const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
]
const contract = new ethers.Contract(setup?.contracts[0].address, abi, Provider)

async function getNftTransferLogs(fromBlock = 26474083, toBlock = 'latest') {
  const filter = {
    address: setup?.contracts[0].address,
    fromBlock,
    toBlock,
    topics: [ethers.utils.id('Transfer(address,address,uint256)'), null, null],
  }
  const logs = await Provider.getLogs(filter)
  const transfers = logs.map((log) => {
    const event = contract.interface.parseLog(log)
    return {
      from: event.args[0],
      to: event.args[1],
      tokenId: event.args[2].toString(),
      blockNumber: log.blockNumber,
      txHash: log.transactionHash,
    }
  })

  await Transfers.insertMany(transfers)
}

// Example usage
getNftTransferLogs(setup?.contracts[0].startBlock).then((logs) => {
  console.log(logs)
})
