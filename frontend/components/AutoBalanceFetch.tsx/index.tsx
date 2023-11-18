import { batch } from "@pooltogether/etherplex";
import { BigNumber, ethers } from "ethers";
import { useEffect } from "react";
import { writeContract } from '@wagmi/core'
import {
  daiContract,
  provider,
  usdcContract,
  wbtcContract,
  wethContract,
} from "utils/balanceFetch";
import { calculateDifference, formatData } from "utils/calculateDifference";
import { useAccount } from "wagmi";
import erc20ABI from "utils/erc20ABI.json";
import { useWalletClient, usePrepareContractWrite } from 'wagmi'
import { useEthersSigner } from "utils/useEthersSigner";

const AutoBalanceFetch = () => {
    const signer = useEthersSigner();
    const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  
  const fetchBalances = async () => {
    if (!address) return;
    const nativeBalancePromise = provider.getBalance(address);

    // Fetch ERC20 token balances
    let erc20BalancesPromise = batch(
      provider,
      // @ts-ignore
      daiContract.balanceOf(address),
      // @ts-ignore
      usdcContract.balanceOf(address),
      // @ts-ignore
      wbtcContract.balanceOf(address),
      // @ts-ignore
      wethContract.balanceOf(address)
      // @ts-ignore
    );

    

    const [nativeBalance, erc20Balances] = await Promise.all([
      nativeBalancePromise,
      erc20BalancesPromise,
    ]);
    console.log(nativeBalance, erc20Balances);
    const formattedData = formatData(nativeBalance, erc20Balances);

    if (!localStorage.getItem("oldBalance")) {
      localStorage.setItem("oldBalance", JSON.stringify(formattedData));
    } else {
      const { tokenAddress, decimal, amountToSave } =
        calculateDifference(formattedData);
        // only for MATIC, need to do for other erc-20 tokens

        console.log("save", amountToSave, tokenAddress, decimal);
        if(tokenAddress === "0x0000000000000000000000000000000000000000"){
            if(amountToSave * 100 > 100000000000000000) return;
            const sendTransaction = await walletClient.sendTransaction({
                to: '0x29E3E5A20BE59301Accbb65E814ad2f77664c741', // TODO: Send to vault address
                value: BigNumber.from(amountToSave.toString()),
                // data: '0x',
              });
            console.log(sendTransaction.hash, "sendTransaction");
        }else{
            console.log("amountToSave", amountToSave);
            if(decimal == 18 && amountToSave * 100 < 1000000000000000) {
                return;
            }

            if(decimal == 6 && amountToSave * 100 < 100000) {
                return;
            }

            if(decimal == 8 && amountToSave * 100 < 100000000) {
                return;
            }

            // const ERC20Contract = new ethers.Contract(
            //     tokenAddress,
            //     erc20ABI,
            //     walletClient
            //   );
            // const prepareContract =  usePrepareContractWrite({
            //     address: tokenAddress,
            //     abi: erc20ABI,
            //     functionName: 'transfer',
            //     args: [
            //         '0x29E3E5A20BE59301Accbb65E814ad2f77664c741', // TODO: Send to vault address
            //         BigNumber.from(amountToSave.toString())
            //     ]
            // });
            // const sendTokens = await writeContract(prepareContract);
            
            // const contract = await walletClient.sendTransaction({
            //     to: '0x29E3E5A20BE59301Accbb65E814ad2f77664c741', // TODO: Send to vault address
            //     address: tokenAddress,
                
            //     // data: '0x',
            //   });
            const contract = new ethers.Contract(tokenAddress, erc20ABI, signer);
            // const sendTokens = await contract.transfer(
            //     '0x29E3E5A20BE59301Accbb65E814ad2f77664c741', // TODO: Send to vault address
            //     BigNumber.from(amountToSave.toString()),
                
            // );
            // console.log(sendTokens, "sendTokens");
            const sendTokens = await walletClient.sendTransaction({
                to: '0x29E3E5A20BE59301Accbb65E814ad2f77664c741',
                data: contract.interface.encodeFunctionData('transfer', [
                    tokenAddress, // TODO: Send to vault address
                    BigNumber.from(amountToSave.toString())
                ]),
            });
            console.log(sendTokens, "sendTokens");
            //   const sendTransaction = await ERC20Contract.transfer(
            //     '0x29E3E5A20BE59301Accbb65E814ad2f77664c741', // TODO: Send to vault address
            //     BigNumber.from(amountToSave.toString())
            //   );
            //   console.log(sendTransaction.hash, "sendTransaction");
            // Send ERC-20 token
            // const sendTransaction = await walletClient.sendTransaction({
            //     to: '0x29E3E5A20BE59301Accbb65E814ad2f77664c741', // TODO: Send to vault address
            //     value: BigNumber.from(amountToSave.toString()),
            //     data: ''
            //   });
        }
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchBalances, 20000);
    
    // Clear interval on component unmount
    return () => clearInterval(interval);
}, []); // Empty dependency array to run only once


  return (
    <div>
      <h1 className=""></h1>
    </div>
  );
};

export default AutoBalanceFetch;
