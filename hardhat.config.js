require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@matterlabs/hardhat-zksync-toolbox");
require("@matterlabs/hardhat-zksync-verify");
module.exports = {
  zksolc: {
    version: "1.3.9",
    compilerSource: "binary",
    settings: {},
  },
  defaultNetwork: "zkSyncTestnet",

   networks: {
    hardhat:{
      chainId:1337
    },
    zkSyncTestnet: {
      url: "https://zksync2-testnet.zksync.dev",
      ethNetwork: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`, // RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
      gas: 2100000,
      gasPrice: 8000000000,
      //timeout: 5000000000,
      verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification'
    },
  },
  solidity: {
    version: "0.8.9",
    settings:{
      optimizer:{
        enabled:true,
        runs:200
      },
    },
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_KEY}`
  }
};