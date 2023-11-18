import { ethers } from "ethers";
import {  useWalletClient } from "wagmi";
import { batch, contract } from "@pooltogether/etherplex";
import erc20ABI from './erc20ABI.json'

export const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mainnet.g.alchemy.com/v2/9UDUFcbGhSzUlaO6mtIAihVmt6HgeeTL"
);
export const daiContract = contract(
  "Dai",
  erc20ABI,
  "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
);

// Alternatively, you can just pass in an ethers.Contract instance
// let ethersContract = new ethers.Contract(USDC_ADDRESS, erc20ABI, provider)
export const usdcContract = contract(
  "Usdc",
  erc20ABI,
  "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
);
export const wbtcContract = contract(
  "Wbtc",
  erc20ABI,
  "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"
);
export const wethContract = contract(
  "Weth",
  erc20ABI,
  "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
);
