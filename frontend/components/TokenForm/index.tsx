import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const TokenForm = () => {
  const [tokenName, setTokenName] = useState("");
  const [goalAmount, setGoalAmount] = useState<number>();
  const [endDate, setEndDate] = useState<string>();
  const [recoveryAddressCheck, setRecoveryAddressCheck] = useState(false);
  const [recoveryAddress, setRecoveryAddress] = useState<string>();
  const [inactivityPeriod, setInactivityPeriod] = useState<string>();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log({
      tokenName,
      goalAmount,
      endDate,
      recoveryAddressCheck,
      recoveryAddress,
    });
  };

  const tokens = [
    { name: "USDT" },
    { name: "USDC" },
    { name: "DAI" },
    { name: "WBTC" },
    { name: "ETH" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 w-1/3 p-6 bg-white border-l border-r-4 border-t border-b-4 border-black"
    >
      {!recoveryAddressCheck && (
        <>
          <label
            htmlFor="tokenName"
            className="block text-black text-xl font-normal font-sans"
          >
            Select Token
          </label>
          <select
            required
            id="tokenName"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="" disabled>
              Select Token
            </option>
            {tokens.map((token) => (
              <option value={token.name}>{token.name}</option>
            ))}
          </select>
          <label
            htmlFor="goalAmount"
            className="block text-black text-xl font-normal font-sans"
          >
            Goal Amount
          </label>
          <div className="flex mt-1 border p-2 w-full">
            <span className="mr-2">$</span>
            <input
              required
              type="number"
              id="goalAmount"
              placeholder="Enter goal amount"
              onChange={(e) => setGoalAmount(parseInt(e.target.value))}
              className="flex-grow"
            />
          </div>
          <label
            htmlFor="endDate"
            className="block text-black text-xl font-normal font-sans"
          >
            End Date
          </label>
          <input
            required
            id="endDate"
            type="date"
            placeholder="Enter end date"
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 w-full"
            min={new Date().toISOString().split("T")[0]}
          />
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setRecoveryAddressCheck(true)}
          >
            <span className="mx-2">Add Nominee</span>
            <FontAwesomeIcon icon={faArrowRight} />
            <span className="font-extralight mx-2">{"(Optional)"}</span>
          </div>
        </>
      )}
      {recoveryAddressCheck && (
        <>
          <label
            htmlFor="recoveryAddress"
            className="block text-black text-xl font-normal font-sans"
          >
            Recovery Address
          </label>
          <input
            type="text"
            id="recoveryAddress"
            placeholder="Enter recovery address"
            onChange={(e) => setRecoveryAddress(e.target.value)}
            className="border p-2 w-full mt-1"
          />
          <label
            htmlFor="inactivityPeriod"
            className="block text-black text-xl font-normal font-sans"
          >
            Inactivity Period
          </label>
          <select
            id="inactivityPeriod"
            onChange={(e) => setInactivityPeriod(e.target.value)}
            className="border p-2 w-full mt-1"
          >
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="86400">1 day</option>
            <option value="604800">1 week</option>
            <option value="2592000">1 month</option>
            <option value="31536000">1 year</option>
          </select>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setRecoveryAddressCheck(false)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span className="mx-2">Vault Details</span>
          </div>
        </>
      )}
      <div className="w-[167px] h-[43px] pl-3.5 pr-[13px] py-[7px] right-28 bottom-14 absolute bg-white border-l border-r-4 border-t border-b-4 border-neutral-900 justify-center items-center inline-flex">
        <button
          type={"submit"}
          className="text-black text-2xl font-normal font-sans"
        >
          Create Vault
        </button>
      </div>
    </form>
  );
};

export default TokenForm;
