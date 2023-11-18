import Navbar from "@/components/Navbar/Navbar";
import makeBlockie from "ethereum-blockies-base64";
import { useAccount } from "wagmi";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home() {
  const { address } = useAccount();
  const router = useRouter();
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
      <div className="flex justify-center items-center px-4 pt-4">
        <div className="h-[475px] flex flex-col justify-center items-center w-3/4 border-t-4 border-l-4 border-r-4 border-black">
          <p className="text-center text-black text-[32px] font-medium font-sans mb-2">
            Create your first vault to save one percent <br />
            on every transaction
          </p>
          <div className="mt-2 shrink basis-0 px-[17px] py-[7px] bg-white border-l border-r-4 border-t border-b-4 border-neutral-900 justify-center items-center inline-flex">
            <button className="text-black text-2xl font-normal font-sans"
                onClick={() => {
                    router.push("/create-vault")
                }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
