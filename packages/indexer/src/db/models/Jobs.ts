import * as mongoose from 'mongoose'
import {BooleanType} from "ts-json-schema-generator";

export interface Jobs {
    txHash: string;
    processed: boolean;
    errored?: boolean;
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
}

export default mongoose.model(
    'Jobs',
    new mongoose.Schema<Jobs>(Schema, {
        timestamps: true,
    })
)
