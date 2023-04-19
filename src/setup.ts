export const setup = {
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
    },
  ],
}
