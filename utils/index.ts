import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { erc20ABI } from "wagmi";
import { LOW_GAS_PAY_CONTRACT } from "../constants";

export const summaryAddress = (addr: string) => 
  addr ? `${addr.slice(0,2)}...${addr.slice(-4)}` : '';

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

export const signApprove = async (
  wallet: string,
  addr: string,
  signer: ethers.Signer
) => {
  if (!addr || !wallet) return;
  const contract = new ethers.Contract(addr, erc20ABI, signer);
  const res = await contract.functions.approve(LOW_GAS_PAY_CONTRACT, '11111111');
  console.log(res);
}