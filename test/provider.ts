import { JsonRpcProvider as ETHJsonRpcProvider } from "ethers";

// https://github.com/ethers-io/ethers.js/blob/main/src.ts/providers/abstract-provider.ts#L714
export class JsonRpcProvider extends ETHJsonRpcProvider {
  override _getBlockTag(blockTag?: any): string | Promise<string> {
    if (
      typeof blockTag === "object" &&
      blockTag != null &&
      (blockTag.blockNumber || blockTag.blockHash)
    ) {
      return blockTag;
    }
    return super._getBlockTag(blockTag);
  }
}

export type OverrideBlock =
  | "latest"
  | "earliest"
  | "pending"
  | "safe"
  | "finalized"
  | { blockHash: string }
  | { blockNumber: number };
