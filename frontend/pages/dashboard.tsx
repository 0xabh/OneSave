import DashboardLayout from "@/components/DashboardLayout";
import NewVaultCard from "@/components/NewVaultCard";
import VaultCard from "@/components/VaultCard";

export default function Home() {
    const data = [
        {
            dollarValue: 100,
            goalTarget: 1000,
            endDate: "2024-10-10",
            token: "USDC"
        },
        {
            dollarValue: 100,
            goalTarget: 1000,
            endDate: "2024-10-10",
            token: "USDC"
        },
    ]

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-center border-4 border-black min-h-[675px] p-5">
          <div className="w-full grid grid-cols-3 gap-x-4 gap-y-10">
                {data.map((vault) => (
                    <VaultCard {...vault} />
                ))}
                <NewVaultCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
