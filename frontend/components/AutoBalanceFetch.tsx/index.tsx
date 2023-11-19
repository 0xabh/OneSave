import { batch } from "@pooltogether/etherplex";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { writeContract } from "@wagmi/core";
import { FusionSDK, NetworkEnum } from "@1inch/fusion-sdk";
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
import { useWalletClient, usePrepareContractWrite } from "wagmi";
import { useEthersSigner } from "utils/useEthersSigner";
import axios from "axios";
import oneSaveFactoryABI from "utils/oneSaveFactoryABI.json";

const AutoBalanceFetch = () => {
  const signer = useEthersSigner();
  const { address, isConnected } = useAccount();
  const [AA_address, setAA_address] = useState(ethers.constants.AddressZero);
//   async function approve(tokenAddress: any, tokenAmount: any) {
//     try {
//         const fromTokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
//       const response = await axios.get(
//         `https://api.1inch.exchange/v5.0/137/approve/transaction?tokenAddress=${fromTokenAddress}&amount=${tokenAmount}`
//       );
//       if (response.data) {
//         let data = response.data;
//         data.gas = 1000000;
//         data.from = address;
//         const tx = await walletClient.sendTransaction(data);
//         console.log(tx);
//         // if (tx.status) {
//         //     console.log("Approval Successul! :)");
//         // } else {
//         //     console.log("Approval unsuccesful :(");
//         //     console.log(tx);
//         // }
//       }
//     } catch (err) {
//       console.log("could not approve token");
//       console.log(err);
//     }
//   }

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
      if (tokenAddress == "0x0000000000000000000000000000000000000000") {
        if ((amountToSave * 100) < 10000000000000000 ) return;

        // await approve(tokenAddress, amountToSave);


        // wrap ETH

        const sendTransaction = await signer!.sendTransaction({
            to: '0x29E3E5A20BE59301Accbb65E814ad2f77664c741', // TODO: Send to vault address
            value: BigNumber.from(amountToSave.toString()),
            // data: '0x',
          });

        console.log(sendTransaction.hash, "sendTransaction");
      } else {
        console.log("amountToSave", amountToSave);
        if (decimal == 18 && amountToSave * 100 < 1000000000000000) {
          return;
        }

        if (decimal == 6 && amountToSave * 100 < 100000) {
          return;
        }

        if (decimal == 8 && amountToSave * 100 < 100000000) {
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
        const sendTokens = await signer!.sendTransaction({
          to: tokenAddress,
          data: contract.interface.encodeFunctionData("transfer", [
            AA_address, // TODO: Send to vault address
            BigNumber.from(amountToSave.toString()),
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
    const setAddress = async () => {
      if (!address) setAA_address(ethers.constants.AddressZero);
      const AAContract = new ethers.Contract(
        "0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe",
        oneSaveFactoryABI,
        signer
      );
      const create2Address = await AAContract.getAddress(address, 0);
      setAA_address(create2Address);
      localStorage.setItem("AA_address", create2Address);
      console.log("AA address:", create2Address);
    };
    setAddress();
  }, [address, isConnected]);

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
