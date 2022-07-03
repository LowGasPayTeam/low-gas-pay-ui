import { TESTNET_TOKENS } from "./constants";
import { NFTToken } from "./services/opensea";

export type RECHARGE = 'RECHARGE';
export type WITHHOLD = 'WITHHOLD';
export type FeeMode = RECHARGE | WITHHOLD;

export interface TransferRecord {
  id: string | number;
  address: string;
  amount: string;
}

export interface TransferSettings {
  token: keyof typeof TESTNET_TOKENS;
  orderGasType: string;
  gasPrice?: string;
  gasLimit?: string;
  startDatetime?: Date;
  endDatetime?: Date;
}

export interface NFTTransferSettings {
  orderGasType: string;
  gasPrice?: string;
  gasLimit?: string;
  startDatetime?: Date;
  endDatetime?: Date;
}

export interface TransferNFTRecord {
  address: string;
  tokens: NFTToken[];
}