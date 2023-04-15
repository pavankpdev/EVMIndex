import * as mongoose from 'mongoose'

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
}

export default mongoose.model(
  'Transfers',
  new mongoose.Schema(Schema, {
    timestamps: true,
  })
)
