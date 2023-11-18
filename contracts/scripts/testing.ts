const hre = require("hardhat");
const erc6551 = require("../artifacts/contracts/ERC6551Account.sol/ERC6551Account.json");

async function main() {
  const deployer = (await hre.ethers.getSigners())[0];
  const provider = await deployer.provider;
  const user = hre.ethers.Wallet.createRandom().connect(provider);
  const recoveryAccount = hre.ethers.Wallet.createRandom().connect(provider);

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy SimpleAccountFactory
//   const factory = await hre.ethers.getContractAt(
//     "SimpleAccountFactory",
//     "0x256F1E9820aDEc785cff97F32A7d50ef5B1a7270"
//   );
  // deploy new factory
    const factoryFactory = await hre.ethers.getContractFactory("SimpleAccountFactory");
    const factory = await factoryFactory.deploy("0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789");
    await factory.deployed();
  console.log("SimpleAccountFactory contract deployed to:", factory.address);

  // Create a new account
  const address = await factory.getAddress(user.address, 0);
  console.log("CFA address:", address);
  const tx = await factory.createAccount(user.address, 0);
  await tx.wait();
  console.log("New account created at:", address);

  const simpleAccount = await hre.ethers.getContractAt(
    "SimpleAccount",
    address,
    deployer
  );

  console.log("Owner:", await simpleAccount.owner());

  // Deploy OneSave
  const oneSaveNft = await hre.ethers.getContractAt(
    "OneSave",
    "0xF13E16Aa07C79c716F5bB92a0392A5D019A0aF2d"
  );
  console.log("OneSave contract deployed to:", oneSaveNft.address);

  // Mint an NFT to the new account
  await oneSaveNft.connect(deployer).safeMint(address);
  console.log("NFT minted to:", address);

  console.log(
    "NFT balance of",
    address,
    ":",
    await oneSaveNft.balanceOf(address)
  );

  const registryAddress = "0x000000006551c19487814612e58FE06813775758";
  const registry = await hre.ethers.getContractAt(
    "ERC6551Registry",
    registryAddress,
    deployer
  );

  const erc6551Implementation = "0x6A067f15Fc1EF7e1D604555084656EEee7460138";

  // get chain id
  const chainId = await hre.network.provider.send("eth_chainId");
  console.log("chainId:", chainId);

  const tokenId = await oneSaveNft.tokenOfOwnerByIndex(address, 0);
  console.log("tokenId:", tokenId.toString());

  const tbaAddress = await registry.account(
    erc6551Implementation,
    hre.ethers.utils.formatBytes32String(tokenId.toString()),
    chainId,
    oneSaveNft.address,
    0
  );
  console.log("TBA address:", tbaAddress);

  const deployTba = await registry.createAccount(
    tbaAddress,
    hre.ethers.utils.formatBytes32String(tokenId.toString()),
    chainId,
    oneSaveNft.address,
    0
  );
  await deployTba.wait();
  console.log("TBA deployed to:", tbaAddress);

  const tbaContract = new hre.ethers.Contract(
    tbaAddress,
    erc6551.abi,
    deployer
  );
  console.log("TBA contract deployed to:", tbaContract.address);

  await deployer.sendTransaction({
    to: user.address,
    value: hre.ethers.utils.parseEther("1"),
  });
  await deployer.sendTransaction({
    to: recoveryAccount.address,
    value: hre.ethers.utils.parseEther("1"),
  });

  console.log("User balance:", hre.ethers.utils.formatEther(await user.getBalance()));

  // Set recovery account
  const setRecoveryAccount = await simpleAccount
    .connect(user)
    .setApprovedAddress(recoveryAccount.address, oneSaveNft.address);
  await setRecoveryAccount.wait();
  console.log(
    "Recovery account set to:",
    await simpleAccount.approvedAddress()
  );

  // recover account
  try {
    const recoverAccount = await simpleAccount
      .connect(recoveryAccount)
      .transferNFTsIfInactive(oneSaveNft.address, recoveryAccount.address);
    await recoverAccount.wait();
    console.log("Account recovered");
  } catch (error) {
    console.error(error);
  }

  // wait for 32 seconds
    await new Promise((resolve) => setTimeout(resolve, 32000));

    // recover account
    try {
      const recoverAccount = await simpleAccount
        .connect(recoveryAccount)
        .transferNFTsIfInactive(oneSaveNft.address, recoveryAccount.address);
      await recoverAccount.wait();
      console.log("Account recovered");
    } catch (error) {
      console.error(error);
    }

    // check nft balance
    console.log(
      "NFT balance of",
      address,
      ":",
      await oneSaveNft.balanceOf(address)
    );
    // check nft balance of recovery account
    console.log(
      "NFT balance of",
      recoveryAccount.address,
      ":",
      await oneSaveNft.balanceOf(recoveryAccount.address)
    );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
