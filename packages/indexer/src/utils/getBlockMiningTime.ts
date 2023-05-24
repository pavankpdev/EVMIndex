import {providers} from "ethers";

export async function getBlockMiningTime(provider: providers.Provider, blockNumber: number): Promise<number> {
    const previousBlock = await provider.getBlock(blockNumber - 1);
    const currentBlock = await provider.getBlock(blockNumber);

    const previousTimestamp = previousBlock.timestamp;
    const currentTimestamp = currentBlock.timestamp;

    return currentTimestamp - previousTimestamp;
}
