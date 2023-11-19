// import "@nomiclabs/hardhat-waffle";
// import "@typechain/hardhat";
import { HardhatUserConfig } from "hardhat/config";
import "hardhat-deploy";
import "@nomiclabs/hardhat-etherscan";
import "dotenv/config";
import "hardhat-celo"

import "solidity-coverage";

import "dotenv/config";

const optimizedComilerSettings = {
  version: "0.8.17",
  settings: {
    optimizer: { enabled: true, runs: 1000000 },
    viaIR: true,
  },
};

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: { enabled: true, runs: 1000000 },
          viaIR: true,
        },
      },
    ],
    overrides: {
      "contracts/core/EntryPoint.sol": optimizedComilerSettings,
      "contracts/SimpleAccount.sol": optimizedComilerSettings,
      "contracts/Api3Paymaster.sol": optimizedComilerSettings,
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    polygon: {
      url: process.env.ALCHEMY_API_URL as string,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
      chainId: 44787,
    },
    mumbai: {
      url: process.env.ALCHEMY_MUMBAI_API_URL as string,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
    },
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_URL as string,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io/",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
    },
    mantleTest: {
      url: "https://rpc.testnet.mantle.xyz", // testnet
      accounts: [process.env.DEPLOYER_PRIVATE_KEY ?? ""],
    },
    baseGoerli: {
      url: "https://goerli.base.org",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
      gasPrice: 1000000000,
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      gasPrice: 1000000000,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
    },
    neonlabs: {
      url: "https://devnet.neonevm.org",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
      chainId: 245022926,
      allowUnlimitedContractSize: false,
      timeout: 1000000,
    },
    zkEVM: {
      url: `https://rpc.public.zkevm-test.net`,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
    },
    arbGoerli: {
      url: "https://goerli-rollup.arbitrum.io/rpc",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
    },
    lineaTestnet: {
      url: "https://linea-testnet.rpc.thirdweb.com",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
    },
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_MUMBAI_API_URL as string,
      },
      accounts: [
        {
          privateKey: process.env.DEPLOYER_PRIVATE_KEY as string,
          balance: "1000000000000000000000"
        }
      ]
    },
  },
  etherscan: {
    apiKey: {
      // sepolia: process.env.ETHERSCAN_API_KEY as string,
      alfajores: process.env.CELOSCAN_API_KEY as string,
      scrollSepolia: process.env.SEPOLIA_API_KEY as string,
      mantleTest: process.env.MANTLE_API_KEY as string,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY as string,
      // polygon: process.env.POLYGONSCAN_API_KEY as string,
      baseGoerli: "PLACEHOLDER_STRING",
      lineaTestnet: process.env.LINEASCAN_API_KEY as string,
    },
    customChains: [
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://sepolia-blockscout.scroll.io/api?",
          browserURL: "https://sepolia-blockscout.scroll.io/",
        },
      },
      {
        network: "mantleTest",
        chainId: 5001,
        urls: {
          apiURL: "https://explorer.testnet.mantle.xyz/api",
          browserURL: "https://explorer.testnet.mantle.xyz",
        },
      },
      {
        network: "baseGoerli",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org",
        },
      },
      {
        network: "lineaTestnet",
        chainId: 59140,
        urls: {
          apiURL: "https://api-testnet.lineascan.build/api",
          browserURL: "https://goerli.lineascan.build/address"
        }
      }
    ],
  },
};

export default config;
