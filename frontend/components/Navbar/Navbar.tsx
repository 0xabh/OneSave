import { useWeb3Modal } from "@web3modal/wagmi/react";
import React from "react";
import { useAccount } from "wagmi";
import { useDisconnect } from 'wagmi'

const Navbar = () => {
  const { open, close } = useWeb3Modal();
  const { address, isConnected, status } = useAccount();
  const { disconnect } = useDisconnect()


  
  return (
    <div className="flex justify-end p-5">
      <button
        className="bg-transparent text-black text-lg font-normal hover:bg-neutral-900 hover:text-white py-2 px-4 border border-neutral-500 hover:border-transparent rounded-none"
        onClick={() => {
            (isConnected ? disconnect() : open())
        }}
      >
        {isConnected ? address : "Connect Wallet"}
      </button>
    </div>
  );
};

export default Navbar;
