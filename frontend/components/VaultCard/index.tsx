import { Switch, Dialog } from "@headlessui/react";
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
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);

  const [transferAddress, setTransferAddress] = useState<string>();

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  const openTransferModal = () => {
    setIsTransferModalOpen(true);
  };

  const closeRedeemModal = () => {
    setIsRedeemModalOpen(false);
  };

  const openRedeemModal = () => {
    setIsRedeemModalOpen(true);
  };
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
      <div className="flex flex-col justify-around h-20 px-6 py-3 my-4">
        <div className="text-black text-base font-normal">
          Goal: ${goalTarget}
        </div>
        <div className="text-black text-base font-normal">
          End Date: {endDate}
        </div>
        <div className="text-black text-base font-normal">Token: {token}</div>
      </div>
      <div className="flex justify-around">
        <div className="border border-neutral-900 justify-center items-center inline-flex p-2 w-[121px] h-[43px]">
          <button
            onClick={openTransferModal}
            className="text-black text-2xl font-normal font-sans"
          >
            Transfer
          </button>
        </div>
        <div className="border border-neutral-900 justify-center items-center inline-flex p-2 w-[121px] h-[43px]">
          <button
            onClick={openRedeemModal}
            className="text-black text-2xl font-normal font-sans"
          >
            Redeem
          </button>
        </div>
      </div>
      <Dialog
        open={isTransferModalOpen}
        onClose={closeTransferModal}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 " />
          <Dialog.Panel className="p-5 px-8 mb-6 w-[466px] h-[399px] relative bg-neutral-100 border-l border-r-4 border-t border-b-4 border-black">
            <Dialog.Title
              className={"text-black text-[32px] font-normal font-sans"}
            >
              Transfer Vault
            </Dialog.Title>
            <Dialog.Description
              className={"h-[200px] flex flex-col justify-around"}
            >
              <form className="flex flex-col justify-around">
                <label
                  htmlFor="transferAddress"
                  className="block text-black text-xl font-normal font-sans"
                >
                  Address
                </label>
                <input
                  required
                  type="text"
                  id="transferAddress"
                  placeholder="Enter transfer address"
                  onChange={(e) => setTransferAddress(e.target.value)}
                  className="border p-2 w-2/3 my-4 border-black"
                />
                <div className="w-[150px] h-[43px] absolute bottom-14 right-8 bg-white border-l border-r-4 border-t border-b-4 border-neutral-900 justify-center items-center inline-flex">
                  <button
                    type="submit"
                    className="text-black text-2xl font-normal font-sans"
                    onClick={closeTransferModal}
                  >
                    Transfer
                  </button>
                </div>
              </form>
            </Dialog.Description>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog
        open={isRedeemModalOpen}
        onClose={closeRedeemModal}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0" />
          <Dialog.Panel className="p-5 px-8 mb-6 w-[466px] h-[399px] relative bg-neutral-100 border-l border-r-4 border-t border-b-4 border-black">
            <Dialog.Title
              className={"text-black text-[32px] font-normal font-sans"}
            >
              Redeem Vault
            </Dialog.Title>
            <Dialog.Description
              className={"h-[200px] flex flex-col justify-around"}
            >
              <div className="my-3">
                <p className="text-black text-2xl font-normal font-sans">
                  Are you sure you want to redeem?
                </p>
              </div>
              <div className="flex flex-col justify-around">
                <p className="text-black text-2xl font-normal font-sans">
                  Current Value: ${dollarValue}
                </p>
                <p className="text-black text-2xl font-normal font-sans">
                  Token: {token}
                </p>
              </div>
            </Dialog.Description>
            <div className="z-100 w-[150px] h-[43px] absolute bottom-14 right-8 bg-white border-l border-r-4 border-t border-b-4 border-neutral-900 justify-center items-center inline-flex">
              <button
                className="text-black text-2xl font-normal font-sans"
                onClick={() => console.log("redeem")}
              >
                Redeem
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default VaultCard;
