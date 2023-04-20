import { ethers } from 'ethers'
import { Provider } from '@/config/provider'
import { Contract } from '@/types'
import Transfers from '@/db/models/Transfers'
import axios from 'axios'

export async function setupListeners(contracts: Contract[]) {
  const provider = Provider

  contracts.forEach((contract) => {
    const { address, abi, events } = contract
    const contractInstance = new ethers.Contract(address, abi, provider)

    events.forEach((eventName) => {
      const eventFilter = contractInstance.filters[eventName]()
      contractInstance.on(eventFilter, async (from, to, tokenId) => {
        // Update the DB with latest transfer
        await Transfers.findOneAndUpdate(
          {
            from,
            to,
            tokenId: tokenId.toString(),
            contract: address,
          },
          {
            from,
            to,
          },
          {
            upsert: true,
          }
        )

        console.log(
          `Event ${eventName} for contract at ${address}: from ${from}, to ${to}, tokenId ${tokenId}`
        )
        await axios({
          method: 'post',
          url: 'https://webhook.site/c9e34d6f-ebdb-486b-81e1-8ddb93fad649', // test webhook
          data: {
            from,
            to,
            tokenId: tokenId.toString(),
            eventName,
            contract: address,
          },
        })
      })
    })
  })
}
