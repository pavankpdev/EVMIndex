import {TransferEventObject} from "@src/types/Meka";
import {Log} from "@ethersproject/abstract-provider";
export const handleTransfer = async (context: TransferEventObject & {txn: Log}) => {
    console.log(context)
    // return TransferModel.create(context);
}
