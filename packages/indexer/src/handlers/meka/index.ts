import {Approval, Transfer} from "@/types/generated";
import {TransferModel} from "@/db/models/Transfer";
import {ApprovalModel} from "@/db/models/Approval";

export const handleTransfer = async (context: Transfer) => {
    console.log(context)
    // return TransferModel.create(context);
}

export const handleApproval = async (context: Approval) => {
    console.log(context)
    return ApprovalModel.create(context);
}