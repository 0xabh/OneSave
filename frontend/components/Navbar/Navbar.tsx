import { useWeb3Modal } from "@web3modal/wagmi/react";
import React, { use, useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useDisconnect } from "wagmi";
import { useState } from "react";
import { connected } from "process";

const Navbar = () => {
  const { open, close } = useWeb3Modal();
  const { address, isConnected, status, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { chains, chain } = useNetwork();

  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (status === "connected") {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [status]);

  return (
    <div className="flex justify-end p-5">
      {connected && (
        <div className="relative">
          <div className="appearance-none bg-transparent text-black text-lg font-normal hover:bg-neutral-900 hover:text-white p-2 border border-neutral-500 hover:border-transparent rounded-none ml-4 pr-8">
            <button onClick={() => open({ view: "Networks" })}>
              {chain?.name}
            </button>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.305 7.695l4.545 4.545 4.546-4.545-1.372-1.372-3.174 3.174-3.173-3.174-1.372 1.372z" />
            </svg>
          </div>
        </div>
      )}
      <button
        className="bg-transparent text-black text-lg font-normal hover:bg-neutral-900 hover:text-white py-2 px-4 border border-neutral-500 hover:border-transparent rounded-none ml-4"
        onClick={() => {
          isConnected ? disconnect() : open();
        }}
      >
        {isConnected ? address : "Connect Wallet"}
      </button>
    </div>
  );
};

export default Navbar;
