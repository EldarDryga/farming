const { expect } = require("chai")
const { ethers } = require("hardhat")
const { BigNumber } = require("ethers");
describe("test_farming", function () {
    let owner
    let acc2
    let acc3
    let tokenA
    let tokenB
    let farming
    beforeEach(async function () {
        const token_A = await ethers.getContractFactory("tokenA");
        tokenA = await token_A.deploy("TokenA", "TA", BigNumber.from("100000000").mul(BigNumber.from("10").pow(18)));
        const token_B = await ethers.getContractFactory("tokenB");
        tokenB = await token_B.deploy("TokenB", "TB", BigNumber.from("100000000").mul(BigNumber.from("10").pow(18)));
        [owner, acc2, acc3, acc4] = await ethers.getSigners()
        const Farming = await ethers.getContractFactory("test_farming", owner)
        farming = await Farming.deploy(tokenA.address, tokenB.address)
    })
    it("Address should have 0 address", async function () {
        let zero_address = "0x0000000000000000000000000000000000000000"
        const farming = await ethers.getContractFactory("test_farming", owner)
        await expect(farming.deploy(zero_address, tokenB.address)).to.be.revertedWith("Address of token = 0")
        await expect(farming.deploy(tokenA.address, zero_address)).to.be.revertedWith("Address of token = 0")
        await expect(farming.deploy(zero_address, zero_address)).to.be.revertedWith("Address of token = 0")

    })
    it("Owner deposited tokenA successfully", async function () {
        const amountOfTokenA = 100000;
        await tokenA.approve(farming.address, amountOfTokenA)
        await farming.connect(owner).deposit_tokenA(50000, 5)
        expect(await tokenA.balanceOf(farming.address)).to.eq(50000)

        await tokenA.connect(acc2).mint(acc2.address, 1000)
        await expect(farming.connect(acc2).deposit_tokenA(500, 5)).to.be.revertedWith("You are not an owner")
    })
    it("Users deposited tokenB successfully", async function(){

        await tokenB.connect(acc2).mint(acc2.address, 500)
        await tokenB.connect(acc2).approve(farming.address, 500)
        await farming.connect(acc2).deposit_tokenB(70)

        const fiveseconds = 5;
        const blockNumBefore = await ethers.provider.getBlockNumber();
        const blockBefore = await ethers.provider.getBlock(blockNumBefore);
        const timestampBefore = blockBefore.timestamp;
        await ethers.provider.send('evm_mine', [timestampBefore + fiveseconds]);
        
        await expect(farming.connect(acc2).deposit_tokenB(70)).to.be.revertedWith("You already deposited tokens, use withdrawAll to claim your revard")
        const amountofTokenB = await farming.poolB()
        expect(await amountofTokenB).to.eq(70)
        expect(await tokenB.balanceOf(farming.address)).to.eq(70)
    })
    it("Calculations are right", async function(){
        const amountOfTokenA = 100000;

        await tokenA.approve(farming.address, amountOfTokenA)
        await farming.connect(owner).deposit_tokenA(100000, 5)
        await expect(farming.connect(acc2).withdrawAll()).to.be.revertedWith("You did not deposit any tokens")

        await tokenB.connect(acc2).mint(acc2.address, 500)
        await tokenB.connect(acc2).approve(farming.address, 500)
        await farming.connect(acc2).deposit_tokenB(75)

        await tokenB.connect(acc3).mint(acc3.address, 500)
        await tokenB.connect(acc3).approve(farming.address, 500)
        await farming.connect(acc3).deposit_tokenB(25)

        expect(await tokenA.balanceOf(acc3.address)).to.eq(0)
        expect(await tokenB.balanceOf(acc3.address)).to.eq(475)
        expect(await tokenA.balanceOf(acc2.address)).to.eq(0)
        expect(await tokenB.balanceOf(acc2.address)).to.eq(425)

        const fiveseconds = 5;
        const blockNumBefore = await ethers.provider.getBlockNumber();
        const blockBefore = await ethers.provider.getBlock(blockNumBefore);
        const timestampBefore = blockBefore.timestamp;
        await ethers.provider.send('evm_mine', [timestampBefore + fiveseconds]);

        await farming.connect(acc3).withdrawAll()
        expect(await tokenA.balanceOf(acc3.address)).to.eq(35)
        expect(await tokenB.balanceOf(acc3.address)).to.eq(500)

        await farming.connect(acc2).withdrawAll()
        expect(await tokenA.balanceOf(acc2.address)).to.eq(250)
        expect(await tokenB.balanceOf(acc2.address)).to.eq(500)

      
    })

})