export type RECHARGE = 'RECHARGE';
export type WITHHOLD = 'WITHHOLD';
export type FeeMode = RECHARGE | WITHHOLD;

export interface TransferRecord {
  id: string | number;
  address: string;
  amount: string;
}