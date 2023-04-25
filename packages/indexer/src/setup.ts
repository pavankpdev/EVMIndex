import {Contract} from "@/types";
import Transfers from "@/db/models/Transfers";

type Setup = {
    contracts: Contract[]
}
export const setup: Setup = {
  contracts: [
    {
      name: 'Chumbi',
      address: '0x86607B5a7aFF30a02bC6442455a3213085B13E76',
      startBlock: 26474083,
      abi: [
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
      ],
      events: ['Transfer'],
      model: Transfers,
      primaryProperty: ["tokenId", "contract"],
      topic: 'Transfer(address,address,uint256)',
      webhook: 'https://webhook.site/ffc6015b-ff0b-47e9-a47f-ffcf5c79b8c4',

    },
    {
      name: 'MEka Drivers',
      address: '0x147923c03ee14c65eae13398926e35ea553cea98',
      startBlock: 32228054,
      abi: [
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
      ],
      events: ['Transfer'],
      model: Transfers,
      primaryProperty: ["tokenId", "contract"],
      topic: 'Transfer(address,address,uint256)',
      webhook: 'https://webhook.site/ffc6015b-ff0b-47e9-a47f-ffcf5c79b8c4',
    },
  ],
}

