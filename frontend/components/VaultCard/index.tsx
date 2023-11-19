import { Switch, Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useEthersSigner } from "utils/useEthersSigner";
import erc6551ABI from "utils/erc6551ABI.json";
import { BigNumber, ethers } from "ethers";
import erc20ABI from "utils/erc20ABI.json";
import { provider } from "utils/balanceFetch";
import oneSaveNFTAbi from "utils/oneSaveNFTAbi.json";
import { useAccount, useNetwork } from "wagmi";
import oneSaveFactoryABI from "utils/oneSaveFactoryABI.json";
import oneSaveABI from "utils/oneSaveABI.json";
import { getBundler } from "utils/bundlerClient";
import entryPointAbi from "utils/entryPointAbi.json";

const VaultCard = ({
  id,
  dollarValue,
  tbaAddress,
  tokenAddress,
  token,
  goalTarget,
  endDate,
  recoveryAddressCheck,
  recoveryAddress,
  inactivityPeriod,
}: {
  id: string;
  dollarValue: number;
  tbaAddress: string;
  tokenAddress: string;
  token: string;
  goalTarget: number;
  endDate: string;
  recoveryAddressCheck: string;
  recoveryAddress: string;
  inactivityPeriod: string;
}) => {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const signer = useEthersSigner();
  const [AA_address, setAA_address] = useState(ethers.constants.AddressZero);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  console.log(chain, "chain");

  const [balanceOfTBA, setBalanceOfTBA] = useState<number>();

  const [transferAddress, setTransferAddress] = useState<string>();

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  const openTransferModal = () => {
    setIsTransferModalOpen(true);
  };

  const closeRedeemModal = () => {
    setIsRedeemModalOpen(false);
  };

  const openRedeemModal = () => {
    setIsRedeemModalOpen(true);
  };
  const [enabled, setEnabled] = useState(false);
  const progress = ((balanceOfTBA ?? 0) / goalTarget) * 100;
  const [loading, setLoading] = useState(true);
  const entryPoint = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  const fetchBalanceOfTBA = async () => {
    setLoading(true);
    // const tbaContract = new ethers.Contract(
    //   tbaAddress,
    //   erc6551ABI,
    //   signer
    // );
    // const balance = await tbaContract.balanceOf();
    try {
      const ERC20Contract = new ethers.Contract(
        tokenAddress,
        erc20ABI,
        provider
      );

      const balance = await ERC20Contract.balanceOf(tbaAddress);

      console.log(balance, "balance");
      setBalanceOfTBA(balance);
      setLoading(false);
    } catch (error) {
      console.log(error, "error");
      setLoading(false);
    }
  };

  const transferTBA = async () => {
    // const tbaContract = new ethers.Contract(
    //   tbaAddress,
    //   erc6551ABI,
    //   signer
    // );
    // const transfer = await tbaContract.transfer(
    //   transferAddress,
    //   balanceOfTBA
    // );
    // console.log(transfer, "transfer");
    const nftContract = new ethers.Contract(
      "0x64A4103aef5ac3043626C6e6975DC66b563C6c99",
      oneSaveNFTAbi,
      signer
    );
    const encodeTransfer = nftContract.interface.encodeFunctionData(
      "transferFrom",
      [AA_address, transferAddress, id]
    );

    const AAContract = new ethers.Contract(AA_address, oneSaveABI, signer);

    const chainId = await signer!.getChainId();
    const client = getBundler(chainId);
    const nonce = await AAContract.getNonce();
    console.log(nonce, "nonce");

    const gasPrice = await signer?.getGasPrice();

    const userOp = {
      sender: AA_address as `0x${string}`,
      nonce,
      initCode: "0x",
      callData: AAContract.interface.encodeFunctionData("execute", [
        "0x64A4103aef5ac3043626C6e6975DC66b563C6c99",
        BigNumber.from(0),
        encodeTransfer,
      ]),
      maxFeePerGas: ethers.utils.hexlify(gasPrice!),
      maxPriorityFeePerGas: ethers.utils.hexlify(gasPrice!),
      callGasLimit: ethers.utils.hexlify(ethers.BigNumber.from(100000)),
      preVerificationGas: ethers.utils.hexlify(ethers.BigNumber.from(50000)),
      verificationGasLimit: ethers.utils.hexlify(ethers.BigNumber.from(500000)),
      paymasterAndData:
        "0xe93eca6595fe94091dc1af46aac2a8b5d79907700000000000000000000000000000000000000000000000000000000065133b6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005d3d07ae8973ba1b8a26d0d72d8882dfa97622942a63c4b655f4928385ce587f6aa2fa1ab347e615d5f39e1214d18f426375da8a01514fb126eb0bb29f0c319d1b",
      signature:
        "0xf1513a8537a079a4d728bb87099b2c901e2c9034e60c95a4d41ac1ed75d6ee90270d52b48af30aa036e9a205ea008e1c62b317e7b3f88b3f302d45fb1ba76a191b" as `0x${string}`,
    };
    console.log(userOp, "userOp");

    const { preVerificationGas, verificationGasLimit, callGasLimit } =
      await client.send("eth_estimateUserOperationGas", [userOp, entryPoint]);
    userOp.paymasterAndData = "0x";
    userOp.callGasLimit = callGasLimit;
    userOp.verificationGasLimit = verificationGasLimit;
    userOp.preVerificationGas = preVerificationGas;

    const entryPointContract = new ethers.Contract(
      entryPoint,
      entryPointAbi,
      signer
    );

    const signature = await signer!.signMessage(
      ethers.utils.arrayify(await entryPointContract.getUserOpHash(userOp))
    );
    userOp.signature = signature;

    const userOpHash = await client.send("eth_sendUserOperation", [
      userOp,
      entryPoint,
    ]);
    // const transfer = await nftContract.transferFrom(
    //   AA_address,
    //   transferAddress,
    //   id
    // );
    let receipt = null;
    while (receipt === null) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      receipt = await client.send("eth_getUserOperationReceipt", [userOpHash]);
      receipt === null
        ? console.log(`Receipt not found, retrying...`)
        : console.log(`Receipt found!`);
    }
    if (!receipt.success) {
      console.log(receipt, "receipt");
      throw new Error("Transaction failed");
    }
    const fetchLocalData = JSON.parse(
      localStorage.getItem("vaultDetails") || "[]"
    );
    const filteredData = fetchLocalData.filter((data: any) => data.id != id);
    localStorage.setItem("vaultDetails", JSON.stringify(filteredData));
  };
  const redeemTBA = async () => {
    // const tbaContract = new ethers.Contract(
    //   tbaAddress,
    //   erc6551ABI,
    //   signer
    // );
    // const transfer = await tbaContract.transfer(
    //   transferAddress,
    //   balanceOfTBA
    // );
    // console.log(transfer, "transfer");
    const nftContract = new ethers.Contract(
      "0x64A4103aef5ac3043626C6e6975DC66b563C6c99",
      oneSaveNFTAbi,
      signer
    );
    const encodeTransfer = nftContract.interface.encodeFunctionData(
      "transferFrom",
      [AA_address, transferAddress, id]
    );

    const AAContract = new ethers.Contract(AA_address, oneSaveABI, signer);

    const chainId = await signer!.getChainId();
    const client = getBundler(chainId);
    const nonce = await AAContract.getNonce();
    console.log(nonce, "nonce");

    const gasPrice = await signer?.getGasPrice();

    const userOp = {
      sender: AA_address as `0x${string}`,
      nonce,
      initCode: "0x",
      callData: AAContract.interface.encodeFunctionData("execute", [
        "0x64A4103aef5ac3043626C6e6975DC66b563C6c99",
        BigNumber.from(0),
        encodeTransfer,
      ]),
      maxFeePerGas: ethers.utils.hexlify(gasPrice!),
      maxPriorityFeePerGas: ethers.utils.hexlify(gasPrice!),
      callGasLimit: ethers.utils.hexlify(ethers.BigNumber.from(100000)),
      preVerificationGas: ethers.utils.hexlify(ethers.BigNumber.from(50000)),
      verificationGasLimit: ethers.utils.hexlify(ethers.BigNumber.from(500000)),
      paymasterAndData:
        "0xe93eca6595fe94091dc1af46aac2a8b5d79907700000000000000000000000000000000000000000000000000000000065133b6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005d3d07ae8973ba1b8a26d0d72d8882dfa97622942a63c4b655f4928385ce587f6aa2fa1ab347e615d5f39e1214d18f426375da8a01514fb126eb0bb29f0c319d1b",
      signature:
        "0xf1513a8537a079a4d728bb87099b2c901e2c9034e60c95a4d41ac1ed75d6ee90270d52b48af30aa036e9a205ea008e1c62b317e7b3f88b3f302d45fb1ba76a191b" as `0x${string}`,
    };
    console.log(userOp, "userOp");

    const { preVerificationGas, verificationGasLimit, callGasLimit } =
      await client.send("eth_estimateUserOperationGas", [userOp, entryPoint]);
    userOp.paymasterAndData = "0x";
    userOp.callGasLimit = callGasLimit;
    userOp.verificationGasLimit = verificationGasLimit;
    userOp.preVerificationGas = preVerificationGas;

    const entryPointContract = new ethers.Contract(
      entryPoint,
      entryPointAbi,
      signer
    );

    const signature = await signer!.signMessage(
      ethers.utils.arrayify(await entryPointContract.getUserOpHash(userOp))
    );
    userOp.signature = signature;

    const userOpHash = await client.send("eth_sendUserOperation", [
      userOp,
      entryPoint,
    ]);
    // const transfer = await nftContract.transferFrom(
    //   AA_address,
    //   transferAddress,
    //   id
    // );
    let receipt = null;
    while (receipt === null) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      receipt = await client.send("eth_getUserOperationReceipt", [userOpHash]);
      receipt === null
        ? console.log(`Receipt not found, retrying...`)
        : console.log(`Receipt found!`);
    }
    if (!receipt.success) {
      console.log(receipt, "receipt");
      throw new Error("Transaction failed");
    }
    const fetchLocalData = JSON.parse(
      localStorage.getItem("vaultDetails") || "[]"
    );
    const filteredData = fetchLocalData.filter((data: any) => data.id != id);
    localStorage.setItem("vaultDetails", JSON.stringify(filteredData));
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
      console.log("AA address:", create2Address);
    };
    setAddress();
  }, [address, isConnected]);
  useEffect(() => {
    console.log(tokenAddress, "tokenAddress", tbaAddress, "tbaAddress");
    fetchBalanceOfTBA();
  }, []);

  return (
    <div className="bg-white border-r-4 border-b-4 border-l border-t border-black h-[300px] w-[300px]">
      <div className="flex justify-end p-3">
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${
            enabled ? "bg-black" : " bg-neutral-300"
          } relative inline-flex items-center h-6 border border-black border-r-4 border-b-4 w-[55px] transition-colors focus:outline-none`}
        >
          <span className="sr-only">Enable</span>
          <span
            className={`${
              enabled ? "translate-x-8" : "translate-x-1"
            } inline-block p-[1px] w-4 h-4 transform bg-white transition-transform`}
          />
        </Switch>
      </div>
      <div className="text-black text-center text-2xl font-medium font-sans">
        $
        {!loading &&
          (token == "USDC"
            ? ethers.utils.formatUnits(BigNumber.from(balanceOfTBA), 6)
            : token == "DAI"
            ? ethers.utils.formatUnits(BigNumber.from(balanceOfTBA), 18)
            : dollarValue)}
      </div>
      <div className="h-2 bg-white border border-black mt-4 w-2/3 mx-auto">
        <div
          className="h-full bg-black"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex flex-col justify-around h-20 px-6 py-3 my-4">
        <div className="text-black text-base font-normal">
          Goal: ${goalTarget}
        </div>
        <div className="text-black text-base font-normal">
          End Date: {endDate}
        </div>
        <div className="text-black text-base font-normal">Token: {token}</div>
      </div>
      <div className="flex justify-around">
        <div className="border border-neutral-900 justify-center items-center inline-flex p-2 w-[121px] h-[43px]">
          <button
            onClick={openTransferModal}
            className="text-black text-2xl font-normal font-sans"
          >
            Transfer
          </button>
        </div>
        <div className="border border-neutral-900 justify-center items-center inline-flex p-2 w-[121px] h-[43px]">
          <button
            onClick={openRedeemModal}
            className="text-black text-2xl font-normal font-sans"
          >
            Redeem
          </button>
        </div>
      </div>
      <Dialog
        open={isTransferModalOpen}
        onClose={closeTransferModal}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 " />
          <Dialog.Panel className="p-5 px-8 mb-6 w-[466px] h-[399px] relative bg-neutral-100 border-l border-r-4 border-t border-b-4 border-black">
            <Dialog.Title
              className={"text-black text-[32px] font-normal font-sans"}
            >
              Transfer Vault
            </Dialog.Title>
            <Dialog.Description
              className={"h-[200px] flex flex-col justify-around"}
            >
              <form className="flex flex-col justify-around">
                <label
                  htmlFor="transferAddress"
                  className="block text-black text-xl font-normal font-sans"
                >
                  Address
                </label>
                <input
                  required
                  type="text"
                  id="transferAddress"
                  placeholder="Enter transfer address"
                  onChange={(e) => setTransferAddress(e.target.value)}
                  className="border p-2 w-2/3 my-4 border-black"
                />
                <div className="w-[150px] h-[43px] absolute bottom-14 right-8 bg-white border-l border-r-4 border-t border-b-4 border-neutral-900 justify-center items-center inline-flex">
                  <button
                    type="submit"
                    className="text-black text-2xl font-normal font-sans"
                    onClick={(e) => {
                      e.preventDefault();
                      transferTBA().then(() => {
                        closeTransferModal();
                      });
                    }}
                  >
                    Transfer
                  </button>
                </div>
              </form>
            </Dialog.Description>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog
        open={isRedeemModalOpen}
        onClose={closeRedeemModal}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0" />
          <Dialog.Panel className="p-5 px-8 mb-6 w-[466px] h-[399px] relative bg-neutral-100 border-l border-r-4 border-t border-b-4 border-black">
            <Dialog.Title
              className={"text-black text-[32px] font-normal font-sans"}
            >
              Redeem Vault
            </Dialog.Title>
            <Dialog.Description
              className={"h-[200px] flex flex-col justify-around"}
            >
              <div className="my-3">
                <p className="text-black text-2xl font-normal font-sans">
                  Are you sure you want to redeem?
                </p>
              </div>
              <div className="flex flex-col justify-around">
                <p className="text-black text-2xl font-normal font-sans">
                  Current Value: ${dollarValue}
                </p>
                <p className="text-black text-2xl font-normal font-sans">
                  Token: {token}
                </p>
              </div>
            </Dialog.Description>
            <div className="z-100 w-[150px] h-[43px] absolute bottom-14 right-8 bg-white border-l border-r-4 border-t border-b-4 border-neutral-900 justify-center items-center inline-flex">
              <button
                className="text-black text-2xl font-normal font-sans"
                onClick={(e) => {
                  e.preventDefault();
                  redeemTBA().then(() => {
                    closeRedeemModal();
                  });
                }}
              >
                Redeem
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default VaultCard;
