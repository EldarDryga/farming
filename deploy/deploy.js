
const { Wallet, utils } = require("zksync-web3");
const ethers = require("ethers");
const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const { BigNumber } = require("ethers");
const zk = require('zksync-web3');
const { HardhatRuntimeEnvironment } = require("hardhat/types");

module.exports = async function (hre) {
  console.log(`Running deploy script for the farming contract`);

  const PRIVATE_KEY = process.env.PRIVATE_KEY ||"";
  const zkWallet = new Wallet(PRIVATE_KEY);

  const deployer = new Deployer(hre, zkWallet);


  const artifact2 = await deployer.loadArtifact("tokenA");

//

  const deploymentFee2 = await deployer.estimateDeployFee(artifact2, ["tokenA", "TA", BigNumber.from("1000000000").mul(BigNumber.from("10").pow(18))]);

  const depositHandle2 = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: zk.utils.ETH_ADDRESS,
    amount: deploymentFee2.mul(2),
  });

  await depositHandle2.wait();

  const parsedFee2 = ethers.utils.formatEther(deploymentFee2.toString());
  console.log(`The deployment is estimated to cost ${parsedFee2} ETH`);

  const tokenAContract2 = await deployer.deploy(artifact2, ["tokenA", "TA", BigNumber.from("1000000000000").mul(BigNumber.from("10").pow(18))]);

  const tokenAAddress2 = tokenAContract2.address;
  console.log(`${artifact2.contractName} was deployed to ${tokenAAddress2}`);
//
const artifact3 = await deployer.loadArtifact("tokenB");

  const deploymentFee3 = await deployer.estimateDeployFee(artifact3, ["tokenB", "TB", BigNumber.from("1000000000000").mul(BigNumber.from("10").pow(18))]);

  const depositHandle3 = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: zk.utils.ETH_ADDRESS,
    amount: deploymentFee3.mul(2),
  });
  await depositHandle3.wait();
  console.log("zdarova");

  const parsedFee3 = ethers.utils.formatEther(deploymentFee3.toString());
  console.log(`The deployment is estimated to cost ${parsedFee3} ETH`);

  const tokenBContract3 = await deployer.deploy(artifact3, ["tokenB", "TB", BigNumber.from("1000000000").mul(BigNumber.from("10").pow(18))]);

  const tokenBAddress3 = tokenBContract3.address;
  console.log(`${artifact3.contractName} was deployed to ${tokenBAddress3}`);
//
const artifact1 = await deployer.loadArtifact("test_farming");

  const deploymentFee1 = await deployer.estimateDeployFee(artifact1, [tokenAAddress2,tokenBAddress3]);

  const depositHandle1 = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: zk.utils.ETH_ADDRESS,
    amount: deploymentFee1.mul(2),
  });
  await depositHandle1.wait();


  const parsedFee = ethers.utils.formatEther(deploymentFee1.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const farmingContract = await deployer.deploy(artifact1, [tokenAAddress2, tokenBAddress3]);

  const farmingAddress1 = farmingContract.address;
  console.log(`${artifact1.contractName} was deployed to ${farmingAddress1}`);
}

