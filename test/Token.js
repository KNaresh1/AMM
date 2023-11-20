const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Token contract", () => {
  let token, deployer, receiver, exchange;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Dapp Token", "DAPP", 1000000);

    [deployer, receiver, exchange] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    const name = "Dapp Token";
    const symbol = "DAPP";
    const decimals = 18;
    const totalSupply = tokens(1000000);

    it("has correct name", async () => {
      expect(await token.name()).to.equal(name);
    });

    it("has correct symbol", async () => {
      expect(await token.symbol()).to.equal(symbol);
    });

    it("has correct decimals", async () => {
      expect(await token.decimals()).to.equal(decimals);
    });

    it("has correct totalSupply", async () => {
      expect(await token.totalSupply()).to.equal(totalSupply);
    });

    it("assigns total supply to deployer", async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
    });
  });

  describe("Sending Tokens", () => {
    let amount, transaction, result;

    describe("Success", () => {
      beforeEach(async () => {
        amount = tokens(100);

        transaction = await token
          .connect(deployer)
          .transfer(receiver.address, amount);
        result = await transaction.wait();
      });

      it("transfers token balances", async () => {
        const senderBalance = await token.balanceOf(deployer.address);
        const receiverBalance = await token.balanceOf(receiver.address);

        expect(senderBalance).to.equal(tokens(999900));
        expect(receiverBalance).to.equal(amount);
      });

      it("emits a Transfer event", async () => {
        const [event] = result.events;
        expect(event.event).to.equal("Transfer");

        const {
          args: { to, from, value },
        } = event;
        expect(from).to.equal(deployer.address);
        expect(to).to.equal(receiver.address);
        expect(value).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("rejects insufficient balances", async () => {
        // Transfer tokens > deployer has
        const invalidAmount = tokens(100000000);
        await expect(
          token.connect(deployer).transfer(receiver.address, invalidAmount)
        ).to.be.reverted;
      });

      it("rejects invalid recepient", async () => {
        const amount = tokens(100);
        await expect(
          token
            .connect(deployer)
            .transfer("0x0000000000000000000000000000000000000000", amount)
        ).to.be.reverted;
      });
    });
  });

  describe("Approving Tokens", () => {
    let amount, transaction, result;

    beforeEach(async () => {
      amount = tokens(100);

      transaction = await token
        .connect(deployer)
        .approve(exchange.address, amount);
      result = await transaction.wait();
    });

    describe("Success", () => {
      it("allocates an allowances for delegated token spending", async () => {
        expect(
          await token.allowance(deployer.address, exchange.address)
        ).to.equal(amount);
      });

      it("emits an Approval event", async () => {
        const [event] = result.events;
        expect(event.event).to.equal("Approval");

        const {
          args: { owner, spender, value },
        } = event;
        expect(owner).to.equal(deployer.address);
        expect(spender).to.equal(exchange.address);
        expect(value).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("rejects invalid spenders", async () => {
        await expect(
          token
            .connect(deployer)
            .approve("0x0000000000000000000000000000000000000000", amount)
        ).to.be.reverted;
      });
    });
  });

  describe("Delegated Token Transfers", () => {
    let amount, transaction, result;

    beforeEach(async () => {
      amount = tokens(100);

      transaction = await token
        .connect(deployer)
        .approve(exchange.address, amount);
      result = await transaction.wait();
    });

    describe("Success", () => {
      beforeEach(async () => {
        transaction = await token
          .connect(exchange)
          .transferFrom(deployer.address, receiver.address, amount);
        result = await transaction.wait();
      });

      it("transfers token balances", async () => {
        const senderBalance = await token.balanceOf(deployer.address);
        const receiverBalance = await token.balanceOf(receiver.address);

        expect(senderBalance).to.equal(tokens(999900));
        expect(receiverBalance).to.equal(amount);
      });

      it("resets the allowance", async () => {
        expect(
          await token.allowance(deployer.address, exchange.address)
        ).to.be.equal(0);
      });

      it("emits a Transfer event", async () => {
        const [event] = result.events;
        expect(event.event).to.equal("Transfer");

        const {
          args: { to, from, value },
        } = event;
        expect(from).to.equal(deployer.address);
        expect(to).to.equal(receiver.address);
        expect(value).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("rejects insufficient amounts", async () => {
        const invalidAmount = tokens(100000000);
        await expect(
          token
            .connect(exchange)
            .transferFrom(deployer.address, receiver.address, invalidAmount)
        ).to.be.reverted;
      });
    });
  });
});
