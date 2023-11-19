import DashboardLayout from "@/components/DashboardLayout";
import NewVaultCard from "@/components/NewVaultCard";
import VaultCard from "@/components/VaultCard";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
interface Vault  {
  id: string;
  tbaAddress: string;
  token: string;
  goalTarget: number;
  endDate: string;
  recoveryAddressCheck: string;
  recoveryAddress: string;
  inactivityPeriod: string;
};
export default function Home() {
  const { isConnected } = useAccount();
  const [data, setData] = useState<Array<Vault>>([]);
  
  // const data = [
  //   {
  //     dollarValue: 100,
  //     goalTarget: 1000,
  //     endDate: "2024-10-10",
  //     token: "USDC",
  //   },
  //   {
  //     dollarValue: 549,
  //     goalTarget: 1000,
  //     endDate: "2024-10-10",
  //     token: "USDC",
  //   },
  // ];

    useEffect(() => {
      const data: Array<Vault> = JSON.parse(localStorage.getItem("vaultDetails") || "[]");
      setData(data);
    }, [])
  

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-center border-4 border-black min-h-[675px] p-5">
          {isConnected ? (
            <div className="w-full grid grid-cols-3 gap-x-4 gap-y-10">
              {data.map((vault: any, index: number) => (
                <VaultCard {...vault}  key={index}/>
              ))}
              <NewVaultCard />
            </div>
          ) : (
            <div className="w-full flex justify-center items-center ">
              <p className="text-black text-[32px] font-normal font-sans">
                Connect your wallet to view your vaults
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
