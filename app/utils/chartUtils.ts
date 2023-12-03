import { ApexOptions } from "apexcharts";
import { Contract } from "ethers";
import { ISwapHistory } from ".";

export const options: ApexOptions = {
  chart: {
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
  },
  title: {
    text: "Reserve History",
    align: "left",
  },
  grid: {
    row: {
      colors: ["#f3f3f3", "transparent"],
      opacity: 0.5,
    },
  },
};

export const getSeries = (swaps: ISwapHistory[], tokens: Contract[]) => {
  if (!tokens[0] || !tokens[1]) {
    return [];
  }
  // Filter swaps by selected tokens
  swaps = swaps
    .filter(
      (s) =>
        s.args.tokenGet === tokens[0].address ||
        s.args.tokenGet === tokens[1].address ||
        s.args.tokenGive === tokens[0].address ||
        s.args.tokenGive === tokens[1].address
    )
    .sort((a, b) => a.args.timestamp - b.args.timestamp); // Sort by date asc to compare history

  const prices = getPrices(swaps);

  return [
    {
      name: "Rate",
      data: prices,
    },
  ];
};

const getPrices = (swaps: ISwapHistory[]) => {
  // Calculate token price to 5 decimal places
  const precision = 100000;

  return swaps.map((swap) => {
    let rate = swap.args.token2Balance / swap.args.token1Balance;
    rate = Math.round(rate * precision) / precision;

    return rate;
  });
};
