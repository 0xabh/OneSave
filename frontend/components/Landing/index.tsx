import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useDisconnect } from "wagmi";
const Landing = () => {
  const { open, close } = useWeb3Modal();
  const { address, isConnected, status } = useAccount();
  const router = useRouter();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (status === "connected") {
      close();
      setTimeout(() => {
        // router.push("/get-started");
      }, 1000);
    }
  }, [status]);

  return (
    <div className="w-full h-auto grid grid-flow-col px-20 py-10 bg-neutral-900">
      <div className="col-span-3">
        <div className="text-white text-2xl font-normal font-sans">OneSave</div>
        <div className=" h-[750px] justify-center items-start flex flex-col bg-neutral-900">
          <div className="my-5 text-white text-5xl font-normal font-sans">
            Setup once and save one <br />
            percent of every transaction
          </div>
          <button
            className="my-5 p-2 border-white border text-white text-2xl font-normal font-sans"
            onClick={() => {
              // console.log("isConnected", isConnected)
              isConnected ?  disconnect() : open();
            }}
          >
            {isConnected ? address : "Connect Wallet"}
          </button>
          <div className="my-5 text-white text-2xl font-normal font-sans">
            Fractional investing in crypto using Account Abstraction <br />
            and Token Bound Accounts{" "}
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <img
          className="w-40 h-40 left-[950px] top-[-10px] absolute"
          src="/assets/Metamask.webp"
        />
        <img
          className="w-40 h-40 left-[950px] top-[180px] absolute"
          src="/assets/Rainbow.webp"
        />
        <img
          className="w-40 h-40 left-[1150px] top-[-54px] absolute"
          src="/assets/Safe.webp"
        />
        <img
          className="w-40 h-40 left-[1150px] top-[136px] absolute"
          src="/assets/Uniswap.webp"
        />
        <img
          className="w-40 h-40 left-[1150px] top-[326px] absolute"
          src="/assets/Coinbase.png"
        />
        <div className="w-40 h-40 pt-0.5 left-[950px] top-[370px] absolute bg-white justify-center items-center inline-flex">
          <img className="w-40 h-40" src="/assets/Trust Wallet.webp" />
        </div>
        <img
          className="w-40 h-40 left-[1150px] top-[516px] absolute"
          src="/assets/Argent.webp"
        />
        <img
          className="w-40 h-40 left-[950px] top-[560px] absolute"
          src="/assets/SafePal.webp"
        />
        <img
          className="w-40 h-40 left-[1150px] top-[706px] absolute border border-white"
          src="/assets/Ledger.webp"
        />
        <img
          className="w-40 h-40 left-[950px] top-[750px] absolute"
          src="/assets/Frontier.webp"
        />
      </div>
    </div>
  );
};

export default Landing;
