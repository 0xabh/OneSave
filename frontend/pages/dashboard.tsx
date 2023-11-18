import Navbar from "@/components/Navbar/Navbar";

export default function Home() {
    return (
        <>
        <Navbar />
        <div className="flex flex-col bg-neutral-100 items-center justify-center w-full">
            <h1>Dashboard</h1>
        </div>
        </>
    )
}