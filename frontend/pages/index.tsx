import AutoBalanceFetch from "@/components/AutoBalanceFetch.tsx";
import Navbar from "@/components/Navbar/Navbar";
import Head from "next/head";
import Landing from "@/components/Landing";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useEthersSigner } from "utils/useEthersSigner";
import oneSaveFactoryABI from "utils/oneSaveFactoryABI.json";
import oneSaveABI from "utils/oneSaveABI.json";
import { useRouter } from "next/router";
import oneSaveNFTAbi from "utils/oneSaveNFTAbi.json";
import { useEffect } from "react";

export default function Home() {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const router = useRouter();
  const checkIfBalanceExists = async () => {
    try {
      const AAContract = new ethers.Contract(
        "0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe",
        oneSaveFactoryABI,
        signer
      );
      const create2Address = await AAContract.getAddress(address, 0);
      const simpleAccount = new ethers.Contract(
        create2Address,
        oneSaveABI,
        signer
      );
      console.log("Owner:", await simpleAccount.owner());
      const oneSaveNft = new ethers.Contract(
        "0x64A4103aef5ac3043626C6e6975DC66b563C6c99",
        oneSaveNFTAbi,
        signer
      );
      const nftBalance = await oneSaveNft.balanceOf(address);
      console.log("nftBalance:", nftBalance.toString());
      if (nftBalance.toString() == "0") {
        router.push("/get-started");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      router.push("/get-started");
    }
  };
  useEffect(() => {
    if(!address) return;
    checkIfBalanceExists();
  }, [address]);

  return (
    <>
      <Head>
        <title>OneSave</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ backgroundColor: "#101111" }}>
        <Landing />
      </main>
    </>
  );
}
