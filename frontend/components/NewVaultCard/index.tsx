import { useRouter } from "next/router";

const NewVaultCard = () => {
  const router = useRouter();
  return (
    <div className="bg-white flex justify-center items-center border-r-4 border-b-4 border-l border-t border-black h-[300px] w-[300px]">
      <div className="flex flex-col items-center justify-center">
        <div className="text-black text-4xl font-normal font-sans">+</div>
        <div className="w-[150px] h-[43px] bg-white border-l border-r-4 border-t border-b-4 border-neutral-900 justify-center items-center inline-flex">
          <button
            className="text-black text-2xl font-normal font-sans"
            onClick={() => {
              router.push("/create-vault");
            }}
          >
            New Vault
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewVaultCard;
