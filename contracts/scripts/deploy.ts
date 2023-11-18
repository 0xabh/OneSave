const { ethers } = require("hardhat");
const { Api3Paymaster, MyERC20} = require("typechain")

async function main() {
  const MyERC20 = await ethers.getContractFactory("MyERC20");
  const myERC20 = await MyERC20.deploy("WBTC", "WBTC", 8);

  await myERC20.deployed();

  const erc20Address = myERC20.address;

  console.log("MyERC20 deployed to:", erc20Address);

  const OneSavePaymaster = await ethers.getContractFactory("Api3Paymaster");
  const oneSavePaymaster = await OneSavePaymaster.deploy(erc20Address);

  await oneSavePaymaster.deployed();

  const paymasterAddress = oneSavePaymaster.address;

  console.log('Paymaster deployed to:', paymasterAddress);
  const signer = (await ethers.getSigners())[0];
  const tx = await signer.sendTransaction({
    to: paymasterAddress,
    value: ethers.utils.parseEther("0.5"),
    data: "0x",
  });
  await tx.wait();
  console.log("balance of paymaster contract", await signer.getBalance());

  const wbtcDAPI3 = "0x28Cac6604A8f2471E19c8863E8AfB163aB60186a";
  const maticDAPI3 = "0x3ACccB328Db79Af1B81a4801DAf9ac8370b9FBF8"

  await oneSavePaymaster.setDapiProxy(wbtcDAPI3, maticDAPI3)

  await myERC20.mint(signer.address, "5000000000000000000000");

  console.log("balance of signer", await myERC20.balanceOf(signer.address));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
