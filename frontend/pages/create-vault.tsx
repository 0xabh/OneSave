import DashboardLayout from "@/components/DashboardLayout";
import TokenForm from "@/components/TokenForm";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="flex justify-center">
        <TokenForm />
      </div>
    </DashboardLayout>
  );
}
