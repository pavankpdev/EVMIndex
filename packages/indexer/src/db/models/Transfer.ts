
/* eslint-disable */
/**
 * This file was automatically generated by EVMIndex.
 * DO NOT MODIFY IT. Instead, modify the grapqhl schema file,
 * and run the build command to regenerate this file again.
 */

import mongoose from "mongoose";
const schema = new mongoose.Schema({"id":{"type":"string"},"owner":{"type":"string"},"approved":{"type":"string"},"tokenId":{"type":"string"},"blockNumber":{"type":"string"},"blockTimestamp":{"type":"string"},"transactionHash":{"type":"string"}});
export const TransferModel = mongoose.model("Transfer", schema);
