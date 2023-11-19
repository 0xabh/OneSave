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
      "0x64A4103aef5ac3043626C6e6975DC66b563C6c99",
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
