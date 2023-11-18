import Navbar from "@/components/Navbar/Navbar";
import makeBlockie from "ethereum-blockies-base64";
import { useAccount } from "wagmi";
import Image from "next/image";

export default function Home() {
  const { address } = useAccount();
  console.log(address);

  return (
    <div className="bg-neutral-100 h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center w-full">
        <div className=" border-4 border-black">
          <Image
            width={160}
            height={160}
            alt="image"
            src={makeBlockie(
              address ?? "0x000000000000000000000000000000000000000000"
            )}
          />
        </div>
        <p className="text-black text-[32px] font-normal font-sans mt-3">{`${address?.slice(
          0,
          6
        )}...${address?.slice(-4)}`}</p>
      </div>
      <div className="flex justify-center items-center p-4">
        <div className="h-[475px] w-3/4 border-t-4 border-l-4 border-r-4 border-black">
          {/* Content goes here */}
        </div>
      </div>
    </div>
  );
}
