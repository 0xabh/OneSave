import { createClient, etherUnits, http } from "viem";
import {
  polygonMumbai,
  polygon,
  polygonZkEvmTestnet,
  scrollSepolia,
  celoAlfajores,
  mantleTestnet,
  baseGoerli,
  lineaTestnet,
  arbitrumGoerli,
  gnosisChiado,
} from "viem/chains";
import { bundlerActions } from "permissionless";
import { ethers } from "ethers";

const polygonMumbaiBundlerClient = new ethers.providers.StaticJsonRpcProvider(
  "http://0.0.0.0:14337/80001/"
);

const polygonBundlerClient = new ethers.providers.StaticJsonRpcProvider(
  "http://0.0.0.0:14337/137/"
);

const polygonZkEvmTestnetBundlerClient =
  new ethers.providers.StaticJsonRpcProvider("http://0.0.0.0:14337/1442/");

const scrollBundlerClient = new ethers.providers.StaticJsonRpcProvider(
  "http://0.0.0.0:14337/534351/"
);

const gnosisTestnetBundlerClient = new ethers.providers.StaticJsonRpcProvider(
  "http://0.0.0.0:14337/10200/"
);

const mantleTestnetBundlerClient = new ethers.providers.StaticJsonRpcProvider(
  "http://0.0.0.0:14337/5001/"
);

const celoTestnetBundlerClient = new ethers.providers.StaticJsonRpcProvider(
  "http://0.0.0.0:14337/44787/"
);

const baseTestnetBundlerClient = new ethers.providers.StaticJsonRpcProvider(
  "http://0.0.0.0:14337/84531/"
);

const lineaTestnetBundlerClient = new ethers.providers.StaticJsonRpcProvider(
  "http://0.0.0.0:14337/59140/"
);

const arbitrumTestnetBundlerClient = new ethers.providers.StaticJsonRpcProvider(
  "http://0.0.0.0:14337/421613/"
);

export const getBundler = (chainId: number) => {
  switch (chainId) {
    case 80001:
      return polygonMumbaiBundlerClient;
    case 137:
      return polygonBundlerClient;
    case 1442:
      return polygonZkEvmTestnetBundlerClient;
    case 534351:
      return scrollBundlerClient;
    case 10200:
      return gnosisTestnetBundlerClient;
    case 5001:
      return mantleTestnetBundlerClient;
    case 44787:
      return celoTestnetBundlerClient;
    case 84531:
      return baseTestnetBundlerClient;
    case 59140:
      return lineaTestnetBundlerClient;
    case 421613:
      return arbitrumTestnetBundlerClient;
    default:
      throw new Error("Unsupported chainId");
  }
};
