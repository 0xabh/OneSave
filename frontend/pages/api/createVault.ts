// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import oneSaveNFTAbi from "utils/oneSaveNFTAbi.json";

type Data = {
  status: boolean;
};
const provider = new ethers.providers.JsonRpcProvider(
  process.env.ALCHEMY_API_URL
);
const wallet = new ethers.Wallet(
  process.env.DEPLOYER_PRIVATE_KEY as string, provider
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const oneSave = new ethers.Contract(
      "0x2055Fef483E16db322a3D04ECe2454C5dc3b7E49",
      oneSaveNFTAbi,
      wallet
    );
    console.log(req.body.address);
    const mintNFT = await oneSave.safeMint(req.body.address, {
      gasPrice: await provider.getGasPrice()
    });
    await mintNFT.wait();

    return res.status(200).json({ status: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: false });
  }
}
