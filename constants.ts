const RINKEBY = 4;
const MAINNET = 1;
export const NETWORKING = {
  CHAIN_ID: RINKEBY
};

export const TESTNET_TOKENS: Record<string, string> = {
  'WETH': '0xDf032Bc4B9dC2782Bb09352007D4C57B75160B15',
  'DAI': '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
  'USDT': '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02',
}

export const MAINNET_TOKENS: Record<string, string> = {
  'DAI': '',
  'USDC': '',
  'USDT': '',
}

export const LOW_GAS_PAY_CONTRACT = '0x5192D14aaD1602df4D8D63a1EDA515BEcBeA3424';

export const TESTNET_NFTS = [
  '0xb74bf94049d2c01f8805b8b15db0909168cabf46',
  '0xd56e9203b218087038adb14f725630d9908b9eb0'
];