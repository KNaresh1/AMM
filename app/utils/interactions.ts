import { Contract } from "ethers";

export const swap = async (
  provider: any,
  amm: Contract,
  token: Contract,
  symbol: string,
  amount: number
) => {
  let transaction;

  const signer = await provider.getSigner();

  transaction = await token.connect(signer).approve(amm?.address, amount);
  await transaction.wait();

  if (symbol === "DAPP") {
    transaction = await amm.connect(signer).swapToken1(amount);
  } else {
    transaction = await amm.connect(signer).swapToken2(amount);
  }
  await transaction.wait();
};
