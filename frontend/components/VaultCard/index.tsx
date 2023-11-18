import { Switch } from "@headlessui/react";
import { useState } from "react";

const VaultCard = ({
  dollarValue,
  token,
  goalTarget,
  endDate,
}: {
  dollarValue: number;
  token: string;
  goalTarget: number;
  endDate: string;
}) => {
  const [enabled, setEnabled] = useState(false);
  const progress = (dollarValue / goalTarget) * 100;
  return (
    <div className="bg-white border-r-4 border-b-4 border-l border-t border-black h-[300px] w-[300px]">
      <div className="flex justify-end p-3">
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${
            enabled ? "bg-black" : " bg-neutral-300"
          } relative inline-flex items-center h-6 border border-black border-r-4 border-b-4 w-[55px] transition-colors focus:outline-none`}
        >
          <span className="sr-only">Enable</span>
          <span
            className={`${
              enabled ? "translate-x-8" : "translate-x-1"
            } inline-block p-[1px] w-4 h-4 transform bg-white transition-transform`}
          />
        </Switch>
      </div>
      <div className="text-black text-center text-2xl font-medium font-sans">
        ${dollarValue}
      </div>
      <div className="h-2 bg-white border border-black mt-4 w-2/3 mx-auto">
        <div
          className="h-full bg-black"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex flex-col justify-between mt-4 px-6">
        <div className="text-black text-base font-normal">
          Goal: ${goalTarget}
        </div>
        <div className="text-black text-base font-normal">
          End Date: {endDate}
        </div>
        <div className="text-black text-base font-normal">Token: {token}</div>
      </div>
      <div className="flex justify-around mt-5">
        <div className="border border-neutral-900 justify-center items-center inline-flex p-2 w-[121px] h-[43px]">
          <button className="text-black text-2xl font-normal font-sans">
            Transfer
          </button>
        </div>
        <div className="border border-neutral-900 justify-center items-center inline-flex p-2 w-[121px] h-[43px]">
          <button className="text-black text-2xl font-normal font-sans">
            Redeem
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaultCard;
