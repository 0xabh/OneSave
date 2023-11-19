# OneSave 

# Aim

To enable users to setup recurring fractional investments in crypto using Account Abstraction and Token Bound Accounts.

# Rationale

There are very few simple web3 native saving ideas for crypto users. Most of them involve multiple complex steps or need the user to manually transfer their assets from a wallet to an external platform. This manual multi step approach is only suited for niche advanced crypto users. 

According to [Chainalysis](https://www.chainalysis.com/blog/crypto-exchanges-on-chain-user-segmentation-guide/) there are 71mn crypto wallets being held by late retail investors with an average holding of $217 each. The report said, "Vast majority of active wallets in a given week are those in late retail, meaning relatively new, low-balance wallets." Even though retail users own more than 90 percent of crypto wallets but they only hold 6.2 percent of digital token assets. 

We built OneSave to make it simple for these users to setup recurring fractional investments in crypto and grow their savings. 

# Solution

OneSave enables crypto users to setup recurring fractional investing and create saving vaults. It creates ERC 4337 compatible contract accounts which are linked to the user’s EOA. These contract accounts hold different vaults as ERC 6551 token bound accounts with one vault for each savings strategy. 

The user connects their primary wallet, picks a savings goal and an end date. Everytime the user completes any transaction one percent of that amount is deducted from the user’s wallet and added to their savings vault. 
 
We use the concept of dead man switch to allow a user to add a wallet address as a nominee. If the saving vault is inactive for a given period of time then the dead man switch is triggered and ownership of the ERC 6551 based token bound account used as saving vault is transferred to the nominee’s address.     

Everytime a user completes a transaction with his wallet he will see a popup to sign another transaction that is one percent of the amount sent in the preceding transaction. This recurring transaction is automatically triggered by OneSave and the user can individually approve or reject any transaction as per their decision. 

These small one percent transactions are added to the user’s saving vault irrespective of whether the ERC20 token transferred by the user is the default token of his vault or not. By using paymaster and gas sponsorship, we convert digital tokens of the user’s transaction to the default ERC20 token selected for the savings vault at the time of setup. 

Since these savings vault are ERC 6551 token bound accounts they can be transferred to another address by the user or redeemed by the owner. Funds in the savings vault can be redeemed by the owner irrespective of whether the vault has reached its savings goal or maturity date. 

The user retains access to the savings vault and funds at all times as all these 6551 token bound accounts are mapped to his 4337 compatible contract account and it can only be accessed by the owner who created it.

# How its Made

OneSave contract account and savings vault are built on top of ethInfitism’s 4337 Account Abstraction implementation and Quicknode’s 6551 resources respectively. The contract account is mapped to the user’s externally owned account while each saving vault is held as a token bound account. We use WalletConnect's web3Modal to allow our users to connect different wallets across multiple chains and networks.

Since the contract account is the owner of the token bound accounts we can offer multiple advantages to the user which are not possible with a traditional EOA. Based on Vitailk’s talk at EthCC in Paris 2023 we have made our custom implementation of dead man’s switch to solve the inheritance problem in crypto. It also helps a user recover his funds in case he forgets the private key to his original externally owned account.

We offer gas sponsorship and paymaster to our users by using Skandha bundler for userops. A user can continue to fill his vault with any of the supported ERC20s and OneSave will convert it to the default token of his savings vault. We use 1inch API to swap these tokens before sending them to the user’s saving vault.

By using ERC 6551 we can make the saving vault as token bound accounts. These saving vaults can hold a single ERC20 token, a combination of multiple ERC20s or a ERC20 and ERC721 together. The advantage of using a ERC 6551 token bound account over a traditional vault is that this saving vault can be redeemed partially and transferred to another user.

Without this we would have needed to transfer the ownership of the entire contract account to another address which isn’t ideal. We also used OpenZeppelin’s Enumerable ERC721 for reference.

OneSave is live and deployed on the following networks:

1. Arbitrum One Goerli
2. Base Goerli
3. Celo Alfa Jores
4. Gnosis Chiado
5. Linea Goerli
6. Mantle Testnet
7. Polygon Mumbai, zkEVM Testnet and PoS
8. Scroll Sepolia

# OneSave Contract Addresses

### ERC4337 Accounts

| Network | Address |
| --- | --- |
| Polygon | [0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe](https://polygonscan.com/address/0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe) |
| Polygon Mumbai | [0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe](https://mumbai.polygonscan.com/address/0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe) |
| Celo Alfajores | [0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe](https://alfajores.celoscan.io/address/0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe) |
| Scroll Seplia | [0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe](https://sepolia.scrollscan.dev/address/0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe) |
| Base Goerli | [0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe](https://goerli.basescan.org/address/0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe#code) |
| Gnosis Chiado | [0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe](https://gnosis-chiado.blockscout.com/address/0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe) |
| Arbitrum One Goerli | [0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe](https://https://goerli.arbiscan.io//address/0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe) |
| ZK-EVM Testnet | [0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe](https://testnet-zkevm.polygonscan.com/address/0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe) |
| Linea Testnet | [0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe](https://goerli.lineascan.build/address/0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe) |
| Mantle Testnet | [0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe](https://explorer.testnet.mantle.xyz/address/0x39d87D951Ce87c173ce403De14d501Bc2Ba29BCe) |


### NFT Contract

| Network | Address |
| --- | --- |
| Polygon | [0x64A4103aef5ac3043626C6e6975DC66b563C6c99](https://polygonscan.com/address/0x64A4103aef5ac3043626C6e6975DC66b563C6c99) |
| Polygon Mumbai | [0x64A4103aef5ac3043626C6e6975DC66b563C6c99](https://mumbai.polygonscan.com/address/0x64A4103aef5ac3043626C6e6975DC66b563C6c99) |
| Celo Alfajores | [0x64A4103aef5ac3043626C6e6975DC66b563C6c99](https://alfajores.celoscan.io/address/0x64A4103aef5ac3043626C6e6975DC66b563C6c99) |
| Scroll Seplia | [0x64A4103aef5ac3043626C6e6975DC66b563C6c99](https://sepolia.scrollscan.dev/address/0x64A4103aef5ac3043626C6e6975DC66b563C6c99) |
| Base Goerli | [0x64A4103aef5ac3043626C6e6975DC66b563C6c99](https://goerli.basescan.org/address/0x64A4103aef5ac3043626C6e6975DC66b563C6c99#code) |
| Gnosis Chiado | [0x64A4103aef5ac3043626C6e6975DC66b563C6c99](https://gnosis-chiado.blockscout.com/address/0x64A4103aef5ac3043626C6e6975DC66b563C6c99) |
| Arbitrum One Goerli | [0x64A4103aef5ac3043626C6e6975DC66b563C6c99](https://https://goerli.arbiscan.io//address/0x64A4103aef5ac3043626C6e6975DC66b563C6c99) |
| ZK-EVM Testnet | [0x64A4103aef5ac3043626C6e6975DC66b563C6c99](https://testnet-zkevm.polygonscan.com/address/0x64A4103aef5ac3043626C6e6975DC66b563C6c99) |
| Linea Testnet | [0x64A4103aef5ac3043626C6e6975DC66b563C6c99](https://goerli.lineascan.build/address/0x64A4103aef5ac3043626C6e6975DC66b563C6c99) |
| Mantle Testnet | [0x64A4103aef5ac3043626C6e6975DC66b563C6c99](https://explorer.testnet.mantle.xyz/address/0x64A4103aef5ac3043626C6e6975DC66b563C6c99) |


### ERC6551 Registry

| Network | Address |
| --- | --- |
| Polygon | [0x000000006551c19487814612e58FE06813775758](https://polygonscan.com/address/0x000000006551c19487814612e58FE06813775758) |
| Polygon Mumbai | [0x000000006551c19487814612e58FE06813775758](https://mumbai.polygonscan.com/address/0x000000006551c19487814612e58FE06813775758) |
| Celo Alfajores | [0x000000006551c19487814612e58FE06813775758](https://alfajores.celoscan.io/address/0x000000006551c19487814612e58FE06813775758) |
| Scroll Seplia | [0x000000006551c19487814612e58FE06813775758](https://sepolia.scrollscan.dev/address/0x000000006551c19487814612e58FE06813775758) |
| Base Goerli | [0x000000006551c19487814612e58FE06813775758](https://goerli.basescan.org/address/0x000000006551c19487814612e58FE06813775758#code) |
| Gnosis Chiado | [0x000000006551c19487814612e58FE06813775758](https://gnosis-chiado.blockscout.com/address/0x000000006551c19487814612e58FE06813775758) |
| Arbitrum One Goerli | [0x000000006551c19487814612e58FE06813775758](https://https://goerli.arbiscan.io//address/0x000000006551c19487814612e58FE06813775758) |
| ZK-EVM Testnet | [0x000000006551c19487814612e58FE06813775758](https://testnet-zkevm.polygonscan.com/address/0x000000006551c19487814612e58FE06813775758) |
| Linea Testnet | [0x000000006551c19487814612e58FE06813775758](https://goerli.lineascan.build/address/0x000000006551c19487814612e58FE06813775758) |
| Mantle Testnet | [0x000000006551c19487814612e58FE06813775758](https://explorer.testnet.mantle.xyz/address/0x000000006551c19487814612e58FE06813775758) |


### ERC6551 Implementation

| Network | Address |
| --- | --- |
| Polygon | [0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209](https://polygonscan.com/address/0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209) |
| Polygon Mumbai | [0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209](https://mumbai.polygonscan.com/address/0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209) |
| Celo Alfajores | [0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209](https://alfajores.celoscan.io/address/0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209) |
| Scroll Seplia | [0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209](https://sepolia.scrollscan.dev/address/0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209) |
| Base Goerli | [0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209](https://goerli.basescan.org/address/0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209#code) |
| Gnosis Chiado | [0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209](https://gnosis-chiado.blockscout.com/address/0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209) |
| Arbitrum One Goerli | [0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209](https://https://goerli.arbiscan.io//address/0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209) |
| ZK-EVM Testnet | [0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209](https://testnet-zkevm.polygonscan.com/address/0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209) |
| Linea Testnet | [0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209](https://goerli.lineascan.build/address/0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209) |
| Mantle Testnet | [0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209](https://explorer.testnet.mantle.xyz/address/0x42a0Eb96aB1E3eB0A570486e1f3bA5b13Bc7a209) |
