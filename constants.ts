const RINKEBY = 4;
const MAINNET = 1;
export const NETWORKING = {
  CHAIN_ID: RINKEBY
};

export const TESTNET_TOKENS: Record<string, string> = {
  'ETH': '',
  'DAI': '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
  'USDT': '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02',
}

export const MAINNET_TOKENS: Record<string, string> = {
  'DAI': '',
  'USDC': '',
  'USDT': '',
}

export const LOW_GAS_PAY_CONTRACT = '0x5192D14aaD1602df4D8D63a1EDA515BEcBeA3424';
