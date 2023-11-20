const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

const shares = ether;

const formatEther = (n) => {
  return ethers.utils.formatEther(n);
};

describe("AMM", () => {
  let deployer, liquidityProvider, investor1, investor2;
  let token1, token2, amm;

  beforeEach(async () => {
    [deployer, liquidityProvider, investor1, investor2] =
      await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    token1 = await Token.deploy("Dapp Token", "DAPP", 1000000);
    token2 = await Token.deploy("USD Token", "USD", 1000000);

    const AMM = await ethers.getContractFactory("AMM");
    amm = await AMM.deploy(token1.address, token2.address);

    // Let liquidityProvider and investors have some initial tokens in order to do trade/exchange
    let transaction = await token1
      .connect(deployer)
      .transfer(liquidityProvider.address, tokens(100000));
    await transaction.wait();

    transaction = await token2
      .connect(deployer)
      .transfer(liquidityProvider.address, tokens(100000));
    await transaction.wait();

    transaction = await token1
      .connect(deployer)
      .transfer(investor1.address, tokens(100000));
    await transaction.wait();

    transaction = await token2
      .connect(deployer)
      .transfer(investor2.address, tokens(100000));
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

  // Integration test
  describe("Swapping tokens", () => {
    let amount, transaction, result, estimate, balance;

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

      /////////////////////////////////////////////////////
      // Liquidity Provider (LP) adds more liqiuity
      ////////////////////////////////////////////////////
      amount = tokens(50000);
      transaction = await token1
        .connect(liquidityProvider)
        .approve(amm.address, amount);
      await transaction.wait();

      transaction = await token2
        .connect(liquidityProvider)
        .approve(amm.address, amount);
      await transaction.wait();

      let token2Deposit = await amm.calculateToken2Deposit(amount);
      // LP adds liquidity
      transaction = await amm
        .connect(liquidityProvider)
        .addLiquidity(amount, token2Deposit);
      await transaction.wait();

      expect(await amm.shares(liquidityProvider.address)).to.equal(tokens(50));

      // Deployer should still have 100 shares
      expect(await amm.shares(deployer.address)).to.equal(tokens(100));

      // Pool should have 150 shares
      expect(await amm.totalShares()).to.equal(tokens(150));

      /////////////////////////////////
      // Investor1 Swaps
      //////////////////////////////////

      // Check price before swapping
      let price = (await amm.token2Balance()) / (await amm.token1Balance());

      // Approve all the tokens that they have to avoid multiple approvals during swaps
      transaction = await token1
        .connect(investor1)
        .approve(amm.address, tokens(100000));
      await transaction.wait();

      // Check investor1 balance before swap
      balance = await token2.balanceOf(investor1.address); // Should be 0 initially

      // Get the estimate token2 tokens that inverstor1 will receive after swap
      estimate = await amm.calculateToken1Swap(tokens(1));

      // Investor1 swaps tokens
      transaction = await amm.connect(investor1).swapToken1(tokens(1));
      result = await transaction.wait();

      await expect(transaction)
        .to.emit(amm, "Swap")
        .withArgs(
          investor1.address,
          token1.address,
          tokens(1),
          token2.address,
          estimate,
          await amm.token1Balance(),
          await amm.token2Balance(),
          (
            await ethers.provider.getBlock(
              await ethers.provider.getBlockNumber()
            )
          ).timestamp
        );

      // Check investor1 balance after swap
      balance = await token2.balanceOf(investor1.address);
      expect(estimate).to.equal(balance);

      expect(await token1.balanceOf(amm.address)).to.equal(
        await amm.token1Balance()
      );

      expect(await token2.balanceOf(amm.address)).to.equal(
        await amm.token2Balance()
      );

      price = (await amm.token2Balance()) / (await amm.token1Balance());
      console.log(`Price: ${price}`);

      // Can swap more times and check the price variations from investor 1 perspective (owns token1 and swapping it for token2)

      ///////////////////////////////////////////////////////////
      // Investor2 Swaps (owns token2 and swapping it for token1)
      ///////////////////////////////////////////////////////////

      // Approve all the tokens that they have to avoid multiple approvals during swaps
      transaction = await token2
        .connect(investor2)
        .approve(amm.address, tokens(100000));
      await transaction.wait();

      // Check investor2 balance before swap
      balance = await token1.balanceOf(investor2.address); // Should be 0 initially

      // Get the estimate token1 tokens that inverstor2 will receive after swap
      estimate = await amm.calculateToken2Swap(tokens(1));

      // Investor2 swaps tokens
      transaction = await amm.connect(investor2).swapToken2(tokens(1));
      result = await transaction.wait();

      await expect(transaction)
        .to.emit(amm, "Swap")
        .withArgs(
          investor2.address,
          token2.address,
          tokens(1),
          token1.address,
          estimate,
          await amm.token1Balance(),
          await amm.token2Balance(),
          (
            await ethers.provider.getBlock(
              await ethers.provider.getBlockNumber()
            )
          ).timestamp
        );

      // Check investor2 balance after swap
      balance = await token1.balanceOf(investor2.address);
      expect(estimate).to.equal(balance);

      expect(await token1.balanceOf(amm.address)).to.equal(
        await amm.token1Balance()
      );

      expect(await token2.balanceOf(amm.address)).to.equal(
        await amm.token2Balance()
      );

      price = (await amm.token2Balance()) / (await amm.token1Balance());

      console.log(`Price: ${price}`);

      ///////////////////////////////////////////////////////////
      // Removing liqiuity - liquidity provider withdraws
      ///////////////////////////////////////////////////////////

      console.log(
        `AMM Token1 balance: ${formatEther(await amm.token1Balance())}`
      );
      console.log(
        `AMM Token2 balance: ${formatEther(await amm.token2Balance())}`
      );

      balance = await token1.balanceOf(liquidityProvider.address);
      console.log(
        `Liquidity Provider Token1 balance before withdraw: ${formatEther(
          balance
        )}`
      );
      balance = await token2.balanceOf(liquidityProvider.address);
      console.log(
        `Liquidity Provider Token2 balance before withdraw: ${formatEther(
          balance
        )}`
      );

      transaction = await amm
        .connect(liquidityProvider)
        .removeLiquidity(shares(50)); // 50 shares
      await transaction.wait();

      balance = await token1.balanceOf(liquidityProvider.address);
      console.log(
        `Liquidity Provider Token1 balance after withdraw: ${formatEther(
          balance
        )}`
      );
      balance = await token2.balanceOf(liquidityProvider.address);
      console.log(
        `Liquidity Provider Token2 balance after withdraw: ${formatEther(
          balance
        )}`
      );
      expect(await amm.shares(liquidityProvider.address)).to.equal(0);
      expect(await amm.shares(deployer.address)).to.equal(shares(100));
      expect(await amm.totalShares()).to.equal(shares(100));
    });
  });
});
