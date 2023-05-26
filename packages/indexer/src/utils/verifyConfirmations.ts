import {Provider as provider} from "@/config/provider";

export async function verifyConfirmations(transactionHash: string, requiredConfirmations: number): Promise<{status: boolean, confirmation: number}> {
    const receipt = await provider.getTransactionReceipt(transactionHash);
    console.log(receipt)

    return {
        status: !!(receipt && receipt.confirmations && receipt.confirmations >= requiredConfirmations),
        confirmation: receipt.confirmations
    }

}
