import {Provider as provider} from "@/config/provider";

export async function verifyConfirmations(transactionHash: string, requiredConfirmations: number): Promise<boolean> {
    const receipt = await provider.getTransactionReceipt(transactionHash);
    console.log(receipt)

    return !!(receipt && receipt.confirmations && receipt.confirmations >= requiredConfirmations);

}
