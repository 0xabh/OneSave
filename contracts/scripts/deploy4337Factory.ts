const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const ContractFactory = await hre.ethers.getContractFactory("SimpleAccountFactory");
    const contract = await ContractFactory.deploy("0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789");

    console.log("SimpleAccountFactory contract deployed to:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });