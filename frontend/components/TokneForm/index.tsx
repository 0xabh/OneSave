import { useState } from "react";

const TokenForm = () => {
  const [tokenName, setTokenName] = useState("");
  const [goalAmount, setGoalAmount] = useState<number>();
  const [endDate, setEndDate] = useState<string>();
  const [recoveryAddressCheck, setRecoveryAddressCheck] = useState(false);
  const [recoveryAddress, setRecoveryAddress] = useState<string>();

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
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <select
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
      <input
        type="number"
        placeholder="Enter goal amount"
        onChange={(e) => setGoalAmount(parseInt(e.target.value))}
        className="border p-2 w-full"
      />
      <input
        type="date"
        placeholder="Enter end date"
        onChange={(e) => setEndDate(e.target.value)}
        className="border p-2 w-full"
      />
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={recoveryAddressCheck}
          onChange={(e) => setRecoveryAddressCheck(e.target.checked)}
          className="border p-2"
        />
        <span className="ml-2">Do you want to add a recovery address?</span>
      </div>
      {recoveryAddressCheck && (
        <input
          type="text"
          placeholder="Enter recovery address"
          onChange={(e) => setRecoveryAddress(e.target.value)}
          className="border p-2 w-full"
        />
      )}
      <button type="submit" className="bg-black text-white p-2 w-full">
        Submit
      </button>
    </form>
  );
};

export default TokenForm;
