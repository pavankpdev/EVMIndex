import {Transfer} from "@/types/generated";
import {Log} from "@ethersproject/abstract-provider";

export const handleTransfer = async (context: Transfer & {txn: Log}) => {
    console.log(context)
}