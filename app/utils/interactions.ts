import { Contract } from "ethers";
import { IStatus, ISwapHistory } from "../utils";
import { formatUnits, shortenAccount } from "./utils";

export const loadBalances = async (
  account: string | undefined,
  amm: Contract,
  tokens: Contract[],
  addBalances: (balances: string[]) => void,
  addShares: (shares: number) => void
) => {
  // BALANCES
  const balance1 = await tokens[0].balanceOf(account);
  const balance2 = await tokens[1].balanceOf(account);
  addBalances([
    formatUnits(balance1.toString()),
    formatUnits(balance2.toString()),
  ]);

  // SHARES
  const shares = await amm.shares(account);
  addShares(Number(formatUnits(shares.toString())));
};

export const swap = async (
  provider: any,
  amm: Contract,
  token: Contract,
  symbol: string,
  amount: string,
  setSwapStatus: (swapStatus: IStatus) => void
) => {
  setSwapStatus({ status: "INPROGRESS", transactionHash: undefined });
  try {
    const signer = await provider.getSigner();

    let transaction = await token.connect(signer).approve(amm?.address, amount);
    await transaction.wait();

    if (symbol === "DAPP") {
      transaction = await amm.connect(signer).swapToken1(amount);
    } else {
      transaction = await amm.connect(signer).swapToken2(amount);
    }
    await transaction.wait();

    setSwapStatus({
      status: "SUCCESS",
      transactionHash: shortenAccount(transaction.hash),
    });
  } catch (error) {
    setSwapStatus({ status: "ERROR", transactionHash: undefined });
    console.log("Error while swapping tokens. ", error);
  }
};

export const addLiquidity = async (
  provider: any,
  amm: Contract,
  tokens: Contract[],
  amounts: string[],
  setDepositStatus: (depositStatus: IStatus) => void
) => {
  setDepositStatus({ status: "INPROGRESS", transactionHash: undefined });
  try {
    const signer = await provider.getSigner();

    let transaction = await tokens[0]
      .connect(signer)
      .approve(amm?.address, amounts[0]);
    await transaction.wait();

    transaction = await tokens[1]
      .connect(signer)
      .approve(amm?.address, amounts[1]);
    await transaction.wait();

    transaction = await amm
      .connect(signer)
      .addLiquidity(amounts[0], amounts[1]);
    await transaction.wait();
    setDepositStatus({
      status: "SUCCESS",
      transactionHash: shortenAccount(transaction.hash),
    });
  } catch (error) {
    setDepositStatus({ status: "ERROR", transactionHash: undefined });
    console.log("Error while depositing tokens. ", error);
  }
};

export const removeLiquidity = async (
  provider: any,
  amm: Contract,
  shares: string,
  setWithdrawStatus: (withdrawStatus: IStatus) => void
) => {
  setWithdrawStatus({ status: "INPROGRESS", transactionHash: undefined });
  try {
    const signer = await provider.getSigner();

    let transaction = await amm.connect(signer).removeLiquidity(shares);
    await transaction.wait();
    setWithdrawStatus({
      status: "SUCCESS",
      transactionHash: shortenAccount(transaction.hash),
    });
  } catch (error) {
    setWithdrawStatus({ status: "ERROR", transactionHash: undefined });
    console.log("Error during withdrawal. ", error);
  }
};

export const loadAllSwaps = async (
  provider: any,
  amm: Contract,
  addSwaps: (swaps: ISwapHistory[]) => void
) => {
  try {
    const endBlock = await provider.getBlockNumber();

    const swapStream = await amm?.queryFilter("Swap", 0, endBlock);

    const swaps = swapStream?.map(
      (event) =>
        ({
          hash: event.transactionHash,
          args: event.args,
        } as ISwapHistory)
    );
    addSwaps(swaps);
  } catch (error) {
    console.log("Error loading swap history. ", error);
  }
};
