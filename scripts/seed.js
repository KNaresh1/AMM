const hre = require("hardhat");
const config = require("../app/config.json");

const tokens = (n) => {
  return hre.ethers.utils.parseUnits(n.toString(), "ether");
};

const ether = tokens;

const shares = ether;

async function main() {
  const [deployer, investor1, investor2, investor3, investor4] =
    await hre.ethers.getSigners();

  const { chainId } = await hre.ethers.provider.getNetwork();

  const dappToken = await hre.ethers.getContractAt(
    "Token",
    config.chains[chainId].dappTokenAddress
  );
  console.log(`Dapp Token fetched: ${dappToken.address}\n`);

  const usdToken = await hre.ethers.getContractAt(
    "Token",
    config.chains[chainId].usdTokenAddress
  );
  console.log(`USD Token fetched: ${usdToken.address}\n`);

  // Send some tokens to investors so that they have some initial balance to do trade
  let transaction = await dappToken
    .connect(deployer)
    .transfer(investor1.address, tokens(10));
  await transaction.wait();

  transaction = await usdToken
    .connect(deployer)
    .transfer(investor2.address, tokens(10));
  await transaction.wait();

  transaction = await dappToken
    .connect(deployer)
    .transfer(investor3.address, tokens(10));
  await transaction.wait();

  transaction = await usdToken
    .connect(deployer)
    .transfer(investor4.address, tokens(10));
  await transaction.wait();

  // Add Liquidity
  let amount = tokens(100);

  console.log(`Fetching AMM...\n`);

  const amm = await hre.ethers.getContractAt(
    "AMM",
    config.chains[chainId].ammAddress
  );
  console.log(`AMM fetched: ${amm.address}\n`);

  // Deployer approves 100 tokens
  transaction = await dappToken.connect(deployer).approve(amm.address, amount);
  await transaction.wait();

  transaction = await usdToken.connect(deployer).approve(amm.address, amount);
  await transaction.wait();

  // Deployer adds liquidity
  console.log(`Adding liquidity... \n`);
  transaction = await amm.connect(deployer).addLiquidity(amount, amount);
  await transaction.wait();

  console.log(`Investor1 swaps DAPP with USD ... \n`);

  // Investor1 approves all his tokens
  transaction = await dappToken
    .connect(investor1)
    .approve(amm.address, tokens(10));
  await transaction.wait();

  // Investor1 swaps 1 token
  transaction = await amm.connect(investor1).swapToken1(tokens(1));
  result = await transaction.wait();

  console.log(`Investor2 swaps USD with DAPP ... \n`);

  // Investor2 approves all his tokens
  transaction = await usdToken
    .connect(investor2)
    .approve(amm.address, tokens(10));
  await transaction.wait();

  // Investor2 swaps 1 token
  transaction = await amm.connect(investor2).swapToken2(tokens(1));
  result = await transaction.wait();

  console.log(`Investor3 swaps DAPP with USD ... \n`);

  // Investor3 approves all his tokens
  transaction = await dappToken
    .connect(investor3)
    .approve(amm.address, tokens(10));
  await transaction.wait();

  // Investor3 swaps all 10 tokens
  transaction = await amm.connect(investor3).swapToken1(tokens(10));
  result = await transaction.wait();

  console.log(`Investor4 swaps USD with DAPP ... \n`);

  // Investor4 approves all his tokens
  transaction = await usdToken
    .connect(investor4)
    .approve(amm.address, tokens(10));
  await transaction.wait();

  // Investor4 swaps 5 tokens
  transaction = await amm.connect(investor4).swapToken2(tokens(5));
  result = await transaction.wait();

  console.log("Finished.\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
