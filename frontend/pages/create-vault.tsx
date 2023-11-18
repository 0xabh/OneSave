import DashboardLayout from "@/components/DashboardLayout";
import TokenForm from "@/components/TokenForm";
import { useEffect, useState } from "react";
import { useEthersSigner } from "utils/useEthersSigner";
import { useAccount } from "wagmi";
import oneSaveFactoryABI from "utils/oneSaveFactoryABI.json";
import oneSaveABI from "utils/oneSaveABI.json";
import { ethers } from "ethers";
import erc6551RegistryABI from "utils/erc6551RegistryABI.json";
import oneSaveNFTAbi  from "utils/oneSaveNFTAbi.json";
import erc6551ABI from "utils/erc6551ABI.json";
import axios from "axios";

export default function Home() {

  const { address } = useAccount();
  const signer = useEthersSigner();
  const [AA_address, setAA_address] = useState('');
  const createVault = async () => {
      const AAContract = new ethers.Contract('0x2902eD2A71B56645761d0190cb7E8A615A86F20c', oneSaveFactoryABI, signer);
      const create2Address = await AAContract.getAddress(address, 0);
      setAA_address(create2Address);
      console.log("CFA address:", create2Address);
      const tx = await AAContract.createAccount(address, 0);
      await tx.wait();
      console.log("New account created at:", create2Address);

      const simpleAccount = new ethers.Contract(create2Address, oneSaveABI, signer);

      console.log("Owner:", await simpleAccount.owner());

      // Deploy 6551 vault
      await generateVault(create2Address);

      const oneSaveNft = new ethers.Contract(
        "0x2055Fef483E16db322a3D04ECe2454C5dc3b7E49",
        oneSaveNFTAbi,
        signer
      );

      const tokenId = await oneSaveNft.tokenOfOwnerByIndex(create2Address, 0);
      console.log("tokenId:", tokenId.toString());

      const erc6551RegistryContract = new ethers.Contract('0x000000006551c19487814612e58FE06813775758', erc6551RegistryABI, signer);

      const tbaAddress = await erc6551RegistryContract.account(
        '0x060b0F0364Bdb754c912f513A42924608657D78E',
        ethers.utils.formatBytes32String(tokenId.toString()),
        '137',
        oneSaveNft.address,
        0
      );

      console.log("TBA address:", tbaAddress);

      const deployTba = await erc6551RegistryContract.createAccount(
        tbaAddress,
        ethers.utils.formatBytes32String(tokenId.toString()),
        '137',
        oneSaveNft.address,
        0
      );

      const tbaContract = new ethers.Contract(
        tbaAddress,
        erc6551ABI,
        signer
      );
      console.log("TBA contract deployed to:", tbaContract.address);
      // const mintNFT = await oneSaveNFTRegistryContract.safeMint(AA_address);
      // await mintNFT.wait();
      // console.log("NFT minted to:", address);
      // console.log(
      //   "NFT balance of",
      //   address,
      //   ":",
      //   await mintNFT.balanceOf(address)
      // );



  }

  const generateVault = async (AA_address: string) => {
    await axios.post("http://localhost:3000/api/createVault", {
      address: AA_address,
    });
  }

  useEffect(() => {
    if (!address) return;
    // createVault();
    
  })
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-center border-4 border-black h-[675px]">
          <div className="w-full flex justify-center items-center ">
            <TokenForm />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
