import * as mongoose from 'mongoose'

export interface Transfer {
  from: string;
  to: string;
  tokenId: string;
  txHash: string;
  contract: string;
  blockNumber: number;
}

const Schema = {
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  tokenId: {
    type: String,
    required: true,
  },
  blockNumber: {
    type: Number,
    required: true,
  },
  txHash: {
    type: String,
    required: true,
  },
  contract: {
    type: String,
    required: true,
  },
}

export default mongoose.model(
  'Transfers',
  new mongoose.Schema<Transfer>(Schema, {
    timestamps: true,
  })
)
