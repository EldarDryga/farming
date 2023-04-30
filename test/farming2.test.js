const { Wallet,Provider, utils } = require("zksync-web3");
const ethers = require("ethers");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const { BigNumber } = require("ethers");
const zk = require('zksync-web3');
const { HardhatRuntimeEnvironment } = require("hardhat/types");


describe.only("test_farming", function () {
  beforeEach(async function () {
    const RICH_WALLET_PK  = "0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e";
    const provider = Provider.getDefaultProvider();

    const wallet = new Wallet(RICH_WALLET_PK, provider);

    const deployer = new Deployer(hre, wallet);
    const artifact2 = await deployer.loadArtifact("tokenA");
    const artifact3 = await deployer.loadArtifact("tokenB");
    const artifact1 = await deployer.loadArtifact("test_farming");


  const tokenAContract = await deployer.deploy(artifact2, ["tokenA", "TA", BigNumber.from("1000000000").mul(BigNumber.from("10").pow(18))]);
  tokenAAddress = tokenAContract.address;
  const tokenBContract = await deployer.deploy(artifact3, ["tokenB", "TB", BigNumber.from("1000000000").mul(BigNumber.from("10").pow(18))]);
  tokenBAddress = tokenBContract.address;
  const farmingContract = await deployer.deploy(artifact1, [tokenAAddress,tokenBAddress]);
  farmingAddress = farmingContract.address;
  console.log("kykykykykykyky")

})


  it("Should revert because of zero address", async function () {

    let zero_address = "0x0000000000000000000000000000000000000000"
    await expect(farmingContract.deploy(zero_address, tokenBAddress)).to.be.revertedWith("Address of token = 0")
  });
});