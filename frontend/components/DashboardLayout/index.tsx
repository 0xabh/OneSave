import makeBlockie from "ethereum-blockies-base64";
import Navbar from "../Navbar/Navbar";
import Image from "next/image";
import { useAccount } from "wagmi";
import Logo from "../Logo";
import { useEthersSigner } from "utils/useEthersSigner";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import oneSaveFactoryABI from "utils/oneSaveFactoryABI.json";

const DashboardLayout = ({ children }) => {
  const { address, isConnected } = useAccount();
  const signer = useEthersSigner();
  const router = useRouter();
  const [AA_address, setAA_address] = useState(ethers.constants.AddressZero);
  useEffect(() => {
    const setAddress = async () => {
      if (!address) setAA_address(ethers.constants.AddressZero);
      const AAContract = new ethers.Contract(
        "0x2902eD2A71B56645761d0190cb7E8A615A86F20c",
        oneSaveFactoryABI,
        signer
      );
      const create2Address = await AAContract.getAddress(address, 0);
      setAA_address(create2Address);
      console.log("AA address:", create2Address);
    };
    setAddress();
  }, [address, isConnected]);

  return (
    <div className="flex h-screen bg-neutral-100">
      <div className="w-1/6 border-r-2 bg-neutral-100 border-black p-4">
        <div className="flex flex-col items-center justify-around w-full mt-20">
          <div className=" border-4 border-black">
            <Image
              width={80}
              height={80}
              alt="image"
              src={makeBlockie(
                AA_address ?? "0x000000000000000000000000000000000000000000"
              )}
            />
          </div>
          {AA_address ? (
            <>
              <p className="text-black text-base font-normal font-sans mt-3">{`${AA_address?.slice(
                0,
                6
              )}...${AA_address?.slice(-4)}`}</p>
              <p className="text-black text-2xl font-medium font-sans mt-4">
                $0
              </p>
            </>
          ) : (
            <p className="text-black text-base font-normal font-sans mt-3">
              Connect Wallet
            </p>
          )}
          <div className="absolute bottom-5">
            <Logo />
          </div>
        </div>
      </div>
      <div className="flex bg-neutral-100 flex-col w-4/5">
        <Navbar />
        <div className="overflow-auto">
          {/* Main content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
