import { useRouter } from "next/router";

const Logo = () => {
    const router = useRouter();
    return (
        <div onClick={() => router.push("/dashboard")} className="text-black text-[32px] font-medium font-sans cursor-pointer">OneSave</div>
    )
}

export default Logo;