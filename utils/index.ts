import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { erc20ABI, erc721ABI } from "wagmi";
import { LOW_GAS_PAY_CONTRACT, TESTNET_TOKENS } from "../constants";

export const summaryAddress = (addr: string) => 
  addr ? `${addr.slice(0,6)}...${addr.slice(-4)}` : '';

export const fetchBalance = async (
  wallet: string,
  addr: string,
  provider: ethers.providers.Provider
) => {
  const contract = new ethers.Contract(addr, erc20ABI, provider);
  const res = await contract.functions.balanceOf(wallet);
  //TODO 格式化代币展示
  return Number(formatEther(res.balance)).toFixed(4);
}

/* 
  检查对应的 Token 是否 Approve
*/
export const checkApproved = async (
  wallet: string,
  addr: string,
  provider: ethers.providers.Provider
) => {
  if (!addr || !wallet) return;
  const contract = new ethers.Contract(addr, erc20ABI, provider);
  const res = await contract.functions.allowance(wallet, LOW_GAS_PAY_CONTRACT);
  return res.remaining.toString()
}

/* 
  对某个 Token 发起 Approve TX
*/
export const signApprove = async (
  wallet: string,
  addr: string,
  signer: ethers.Signer
) => {
  if (!addr || !wallet) return;
  const contract = new ethers.Contract(addr, erc20ABI, signer);
  return await contract.functions.approve(LOW_GAS_PAY_CONTRACT, ethers.constants.MaxUint256);
}

/* 
  检查对应的 NFT 是否 Approve
*/
export const checkNFTApproved = async (
  wallet: string,
  addr: string,
  provider: ethers.providers.Provider
) => {
  if (!addr || !wallet) return;
  const contract = new ethers.Contract(addr, erc721ABI, provider);
  const res = await contract.functions.isApprovedForAll(wallet, LOW_GAS_PAY_CONTRACT);
  return res.remaining.toString()
}

/* 
  对某个 Token 发起 Approve TX
*/
export const signSetApproveForAll = async (
  wallet: string,
  addr: string,
  signer: ethers.Signer
) => {
  if (!addr || !wallet) return;
  const contract = new ethers.Contract(addr, erc20ABI, signer);
  return await contract.functions.setApprovalForAll(LOW_GAS_PAY_CONTRACT, true);
}

/**
 * 
 */
export const getTokenByContract = (contract: string) => 
  Object.keys(TESTNET_TOKENS).find((key => TESTNET_TOKENS[key] === contract));
