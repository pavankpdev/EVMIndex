import * as mongoose from 'mongoose'

export interface Jobs {
    txHash: string;
    processed: boolean;
    errored?: boolean;
    retries: number;
}

const Schema = {
    txHash: {
        type: String,
        required: true,
    },
    processed: {
        type: Boolean,
        default: false,
    },
    errored: {
        type: Boolean,
        default: false,
    },
    retries: {
        type: Number,
        default: 0,
    },
}

export default mongoose.model(
    'Jobs',
    new mongoose.Schema<Jobs>(Schema, {
        timestamps: true,
    })
)
