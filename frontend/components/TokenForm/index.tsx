import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useEthersSigner } from "utils/useEthersSigner";
import oneSaveFactoryABI from "utils/oneSaveFactoryABI.json";
import oneSaveABI from "utils/oneSaveABI.json";
import { useRouter } from "next/router";
import oneSaveNFTAbi from "utils/oneSaveNFTAbi.json";
import { useEffect } from "react";
import erc6551RegistryABI from "utils/erc6551RegistryABI.json";
import erc6551ABI from "utils/erc6551ABI.json";
import axios from "axios";

const TokenForm = () => {
  const router = useRouter();
  const [tokenName, setTokenName] = useState("");
  const [goalAmount, setGoalAmount] = useState<number>();
  const [endDate, setEndDate] = useState<string>();
  const [recoveryAddressCheck, setRecoveryAddressCheck] = useState(false);
  const [recoveryAddress, setRecoveryAddress] = useState<string>();
  const [inactivityPeriod, setInactivityPeriod] = useState<string>();
  const { address } = useAccount();
  const signer = useEthersSigner();
  const [AA_address, setAA_address] = useState("");
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    await createVault();

    // localStorage.setItem(
    //   "vaultDetails",
    //   JSON.stringify({
    //     tokenName,
    //     goalAmount,
    //     endDate,
    //     recoveryAddressCheck,
    //     recoveryAddress,
    //     inactivityPeriod,
    //   })
    // );
    console.log({
      tokenName,
      goalAmount,
      endDate,
      recoveryAddressCheck,
      recoveryAddress,
    });
  };
  const createVault = async () => {
    const AAContract = new ethers.Contract(
      "0x2902eD2A71B56645761d0190cb7E8A615A86F20c",
      oneSaveFactoryABI,
      signer
    );
    const create2Address = await AAContract.getAddress(address, 0);
    setAA_address(create2Address);
    console.log("AA address:", create2Address);
    const tx = await AAContract.createAccount(address, 0);
    await tx.wait();
    console.log("New account created at:", create2Address);

    const simpleAccount = new ethers.Contract(
      create2Address,
      oneSaveABI,
      signer
    );

    console.log("Owner:", await simpleAccount.owner());

    // Deploy 6551 vault
    await generateVault(create2Address);

    const oneSaveNft = new ethers.Contract(
      "0x2055Fef483E16db322a3D04ECe2454C5dc3b7E49",
      oneSaveNFTAbi,
      signer
    );
    // fetch balance of oneSaveNft.balanceOf(create2Address)
    const nftBalance = await oneSaveNft.balanceOf(create2Address);

    const tokenId = await oneSaveNft.tokenOfOwnerByIndex(create2Address, nftBalance.sub(1));
    console.log("tokenId:", tokenId.toString());

    const erc6551RegistryContract = new ethers.Contract(
      "0x000000006551c19487814612e58FE06813775758",
      erc6551RegistryABI,
      signer
    );

    const tbaAddress = await erc6551RegistryContract.account(
      "0x060b0F0364Bdb754c912f513A42924608657D78E",
      ethers.utils.formatBytes32String(tokenId.toString()),
      "137",
      oneSaveNft.address,
      0
    );


    console.log("TBA address:", tbaAddress);

    const deployTba = await erc6551RegistryContract.createAccount(
      tbaAddress,
      ethers.utils.formatBytes32String(tokenId.toString()),
      "137",
      oneSaveNft.address,
      0
    );

    await deployTba.wait();

    const tbaContract = new ethers.Contract(tbaAddress, erc6551ABI, signer);
    console.log("TBA contract deployed to:", tbaContract.address);
    const data = {
      id: tokenId,
      tbaAddress: tbaAddress,
      tokenName,
      goalAmount,
      endDate,
      recoveryAddressCheck,
      recoveryAddress,
      inactivityPeriod,
    };
    const dataArr = JSON.parse(localStorage.getItem("vaultDetails") || "[]");
    localStorage.setItem("vaultDetails", JSON.stringify([...dataArr, data]));

    
    router.push("/dashboard");
  };

  const generateVault = async (AA_address: string) => {
    await axios.post("http://localhost:3000/api/createVault", {
      address: AA_address,
    });
  };

  const tokens = [
    { name: "USDT" },
    { name: "USDC" },
    { name: "DAI" },
    { name: "WBTC" },
    { name: "ETH" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 w-1/3 p-6 bg-white border-l border-r-4 border-t border-b-4 border-black"
    >
      {!recoveryAddressCheck && (
        <>
          <label
            htmlFor="tokenName"
            className="block text-black text-xl font-normal font-sans"
          >
            Select Token
          </label>
          <select
            required
            id="tokenName"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="" disabled>
              Select Token
            </option>
            {tokens.map((token) => (
              <option value={token.name}>{token.name}</option>
            ))}
          </select>
          <label
            htmlFor="goalAmount"
            className="block text-black text-xl font-normal font-sans"
          >
            Goal Amount
          </label>
          <div className="flex mt-1 border p-2 w-full">
            <span className="mr-2">$</span>
            <input
              required
              type="number"
              id="goalAmount"
              placeholder="Enter goal amount"
              onChange={(e) => setGoalAmount(parseInt(e.target.value))}
              className="flex-grow"
            />
          </div>
          <label
            htmlFor="endDate"
            className="block text-black text-xl font-normal font-sans"
          >
            End Date
          </label>
          <input
            required
            id="endDate"
            type="date"
            placeholder="Enter end date"
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 w-full"
            min={new Date().toISOString().split("T")[0]}
          />
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setRecoveryAddressCheck(true)}
          >
            <span className="mx-2">Add Nominee</span>
            <FontAwesomeIcon icon={faArrowRight} />
            <span className="font-extralight mx-2">{"(Optional)"}</span>
          </div>
        </>
      )}
      {recoveryAddressCheck && (
        <>
          <label
            htmlFor="recoveryAddress"
            className="block text-black text-xl font-normal font-sans"
          >
            Recovery Address
          </label>
          <input
            type="text"
            id="recoveryAddress"
            placeholder="Enter recovery address"
            onChange={(e) => setRecoveryAddress(e.target.value)}
            className="border p-2 w-full mt-1"
          />
          <label
            htmlFor="inactivityPeriod"
            className="block text-black text-xl font-normal font-sans"
          >
            Inactivity Period
          </label>
          <select
            id="inactivityPeriod"
            onChange={(e) => setInactivityPeriod(e.target.value)}
            className="border p-2 w-full mt-1"
          >
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="86400">1 day</option>
            <option value="604800">1 week</option>
            <option value="2592000">1 month</option>
            <option value="31536000">1 year</option>
          </select>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setRecoveryAddressCheck(false)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span className="mx-2">Vault Details</span>
          </div>
        </>
      )}
      <div className="w-[167px] h-[43px] pl-3.5 pr-[13px] py-[7px] right-28 bottom-14 absolute bg-white border-l border-r-4 border-t border-b-4 border-neutral-900 justify-center items-center inline-flex">
        <button
          type={"submit"}
          className="text-black text-2xl font-normal font-sans"
        >
          Create Vault
        </button>
      </div>
    </form>
  );
};

export default TokenForm;
