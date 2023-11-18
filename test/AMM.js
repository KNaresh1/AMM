const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

describe("AMM", () => {
  let deployer, liquidityProvider;
  let token1, token2, amm;
  let transaction, result;

  beforeEach(async () => {
    [deployer, liquidityProvider] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    token1 = await Token.deploy("Dapp Token", "DAPP", 1000000);
    token2 = await Token.deploy("USD Token", "USD", 1000000);

    const AMM = await ethers.getContractFactory("AMM");
    amm = await AMM.deploy(token1.address, token2.address);

    let transaction = await token1
      .connect(deployer)
      .transfer(liquidityProvider.address, tokens(100000));
    await transaction.wait();

    transaction = await token2
      .connect(deployer)
      .transfer(liquidityProvider.address, tokens(100000));
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("has an address", () => {
      expect(amm.address).to.not.equal(0x0);
    });

    it("tracks token1 address", async () => {
      expect(await amm.token1()).to.equal(token1.address);
    });

    it("tracks token2 address", async () => {
      expect(await amm.token2()).to.equal(token2.address);
    });
  });

  describe("Swapping tokens", () => {
    let amount, transaction, result;

    it("facilitates token swap", async () => {
      amount = tokens(100000);

      // Deployer approves 100k tokens
      transaction = await token1.connect(deployer).approve(amm.address, amount);
      await transaction.wait();

      transaction = await token2.connect(deployer).approve(amm.address, amount);
      await transaction.wait();

      // Deployer add liquidity
      transaction = await amm.connect(deployer).addLiquidity(amount, amount);
      await transaction.wait();

      // Check AMM receives tokens
      expect(await token1.balanceOf(amm.address)).to.equal(amount);
      expect(await token2.balanceOf(amm.address)).to.equal(amount);

      // Check liquidity token balances
      expect(await amm.token1Balance()).to.equal(amount);
      expect(await amm.token2Balance()).to.equal(amount);

      // Check deployer has 100 shares initially
      expect(await amm.shares(deployer.address)).to.equal(tokens(100));

      // Check pool has 100 total shares
      expect(await amm.totalShares()).to.equal(tokens(100));
    });
  });
});
