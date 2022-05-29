import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { erc20ABI } from "wagmi";

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