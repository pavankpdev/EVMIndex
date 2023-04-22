import { ethers } from 'ethers'
import { Provider } from '@/config/provider'
import { Contract } from '@/types'
import Transfers from '@/db/models/Transfers'
import axios from 'axios'

export async function setupListeners(contracts: Contract[]) {
  const provider = Provider

  contracts.forEach((contract) => {
    const { address, abi, events, webhook, primaryProperty, model } = contract
    const contractInstance = new ethers.Contract(address, abi, provider)

    if(!events) throw new Error('Events are required for live indexing');
    if(!webhook) throw new Error('Webhook is required for live indexing');
    if(!primaryProperty) throw new Error('Primary property is required for live indexing');
    if(!model) throw new Error('Model is required for live indexing');

    events.forEach((eventName) => {
      const eventFilter = contractInstance.filters[eventName]()
      contractInstance.on(eventFilter, async (eventParam) => {

        const dbFilter: Record<string, string | number> = {}
        for (let i = 0; i < primaryProperty.length; i++) {
          const key: string = primaryProperty[i]
          dbFilter[key] = eventParam[key]
        }
        // Update the DB with latest transfer
        await Transfers.findOneAndUpdate(
          dbFilter,
          {
            $set: eventParam,
          },
          {
            upsert: true,
          }
        )

        await axios({
          method: 'post',
          url: webhook,
          data: {
            ...eventParam,
            eventName,
            contract: address,
          },
        })
      })
    })
  })
}
