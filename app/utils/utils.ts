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

export const formatDate = (milliseconds: number) => {
  const date = new Date(milliseconds);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  } as Intl.DateTimeFormatOptions;

  const formattedDate = date.toLocaleDateString(undefined, options);
  return formattedDate;
};
