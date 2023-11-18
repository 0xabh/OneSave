import DashboardLayout from "@/components/DashboardLayout";
import TokenForm from "@/components/TokenForm";

export default function Home() {
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
