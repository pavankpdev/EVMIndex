import { ethers } from 'ethers'
import { Provider } from '@/config/provider'
import { Contract } from '@/types'
import Transfers from '@/db/models/Transfers'

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
        // TODO: Call webhooks here
      })
    })
  })
}
