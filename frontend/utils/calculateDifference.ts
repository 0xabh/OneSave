import { BigNumber } from "ethers";
import { DAI, USDC, WBTC, WETH } from "./tokenDetails";

export const formatData = (nativeBal: BigNumber, tokenBal: any) => {
    console.log(parseInt(tokenBal['Dai'].balanceOf), 'debugging tokenBal');
    const data = {
        native: {
            address: "0x0000000000000000000000000000000000000000",
            balance: parseInt(nativeBal.toString()),
        },
        dai: {
            address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
            balance: parseInt(tokenBal['Dai'].balanceOf),
            decimals: 18
        },
        usdc: {
            address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
            balance: parseInt(tokenBal['Usdc'].balanceOf),
            decimals: 6
        },
        wbtc: {
            address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
            balance: parseInt(tokenBal['Wbtc'].balanceOf),
            decimals: 8
        },
        weth: {
            address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
            balance: parseInt(tokenBal['Weth'].balanceOf),
            decimals: 18
        },
        

    }
    return data;
}


export const calculateDifference = (data: any) => {
    const { native, dai, usdc, wbtc, weth } = data;
   
    const oldBal = JSON.parse(localStorage.getItem('oldBalance') || '{}');
    localStorage.setItem('oldBalance', JSON.stringify(data));
    console.log(oldBal, 'debugging oldBal');
    const oldNative = oldBal.native.balance;
    const oldDai = oldBal.dai.balance;
    const oldUsdc = oldBal.usdc.balance;
    const oldWbtc = oldBal.wbtc.balance;
    const oldWeth = oldBal.weth.balance;
    if(parseInt(oldDai) > parseInt(dai.balance)) {
        const diff = parseInt(oldDai) - parseInt(dai.balance);
        return {
            tokenAddress: DAI.address,
            decimal: 18,
            amountToSave: Math.floor(diff / 100)
        };
    } else if(parseInt(oldUsdc) > parseInt(usdc.balance)) {
        const diff = parseInt(oldUsdc) - parseInt(usdc.balance);
        return {
            tokenAddress: USDC.address,
            decimal: 6,
            amountToSave: Math.floor(diff / 100)
        }
    } else if(parseInt(oldWbtc) > parseInt(wbtc.balance)) {
        const diff = parseInt(oldWbtc) - parseInt(wbtc.balance);
        return {
            tokenAddress: WBTC.address,
            decimal: 8,
            amountToSave: Math.floor(diff / 100)
        }
    } else if(parseInt(oldWeth) > parseInt(weth.balance)) {
        const diff = parseInt(oldWeth) - parseInt(weth.balance);
        return {
            tokenAddress: WETH.address,
            decimal: 18,
            amountToSave: Math.floor(diff / 100)
        
        }
    } else if(parseInt(oldNative) > parseInt(native.balance)) {

        const diff = (parseInt(oldNative) - parseInt(native.balance)) > 1000000000000000  ? parseInt(oldNative) - parseInt(native.balance) : 0;
        console.log(diff, 'debugging diff');
        // amount to save should be 1% of the difference and it should not leave any decimals
        return {
            tokenAddress: "0x0000000000000000000000000000000000000000",
            decimal: 18,
            amountToSave: Math.floor(diff / 100)
        };
    } else {
        return {
            tokenAddress: "0x0000000",
            decimal: 18,
            amountToSave: 0
        };
    }

}