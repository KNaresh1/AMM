import { ethers } from "ethers";

export const formatUnits = (value: string) => {
  return ethers.utils.formatUnits(value, "ether");
};

export const parseUnits = (value: string) => {
  return ethers.utils.parseUnits(value, "ether");
};

export const shortenAccount = (account: string) => {
  return `${account.substring(0, 6)}...${account.substring(
    account.length - 4
  )}`;
};
