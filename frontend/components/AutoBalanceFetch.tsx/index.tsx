import { batch } from "@pooltogether/etherplex";
import { BigNumber } from "ethers";
import { useEffect } from "react";
import {
  daiContract,
  provider,
  usdcContract,
  wbtcContract,
  wethContract,
} from "utils/balanceFetch";
import { calculateDifference, formatData } from "utils/calculateDifference";
import { useAccount } from "wagmi";

import { useWalletClient } from "wagmi";

const AutoBalanceFetch = () => {
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
      if (amountToSave * 100 > 10000000000000000 ) {
        console.log("save", amountToSave, tokenAddress, decimal);

        const sendTransaction = await walletClient.sendTransaction({
            to: '0x29E3E5A20BE59301Accbb65E814ad2f77664c741',
            value: BigNumber.from(amountToSave.toString()),
            // data: '0x',
          });
        console.log(sendTransaction.hash, "sendTransaction");
      }
    }
  };

  useEffect(() => {
    setInterval(async () => {
      fetchBalances();
      
    }, 10000);
    // fetchBalances();
  });

  return (
    <div>
      {/* <h1 className="">AutoBalanceFetch</h1> */}
    </div>
  );
};

export default AutoBalanceFetch;
