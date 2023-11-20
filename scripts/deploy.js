const hre = require("hardhat");

async function main() {
  // Fetch contract to deploy
  const Token = await hre.ethers.getContractFactory("Token");

  const dappToken = await Token.deploy("Dapp Token", "DAPP", 1000000);
  await dappToken.deployed();
  console.log(`Dapp Token deployed to: ${dappToken.address}\n`);

  let usdToken = await Token.deploy("USD Token", "USD", 1000000);
  await usdToken.deployed();
  console.log(`USD Token deployed to: ${usdToken.address}\n`);

  const AMM = await ethers.getContractFactory("AMM");
  const amm = await AMM.deploy(dappToken.address, usdToken.address);
  console.log(`AMM contract deployed to: ${amm.address}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
