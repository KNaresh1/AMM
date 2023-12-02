import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { useEffect } from "react";

import AMM_ABI from "../abis/AMM.json";
import TOKEN_ABI from "../abis/Token.json";
import config from "../config";
import useContractStore from "../store";
import { formatUnits } from "../utils/utils";
import { loadBalances } from "../utils";

const useLoadContract = () => {
  const { provider, account, chainId } = useWeb3React();

  const [
    addTokenContracts,
    addShares,
    addSymbols,
    addBalances,
    addAmmContract,
  ] = useContractStore((s) => [
    s.addTokenContracts,
    s.addShares,
    s.addSymbols,
    s.addBalances,
    s.addAmmContract,
  ]);

  const currentChainConfig = config.chains[chainId?.toString() || ""];

  const loadContract = async () => {
    try {
      // TOKENS
      const dapp = new Contract(
        currentChainConfig.dappTokenAddress,
        TOKEN_ABI,
        provider
      );
      const usd = new Contract(
        currentChainConfig.usdTokenAddress,
        TOKEN_ABI,
        provider
      );
      addTokenContracts([dapp, usd]);
      addSymbols([await dapp.symbol(), await usd.symbol()]);

      // AMM
      const amm = new Contract(
        currentChainConfig.ammAddress,
        AMM_ABI,
        provider
      );
      addAmmContract(amm);

      await loadBalances(account, amm, [dapp, usd], addBalances, addShares);
    } catch (error) {
      console.error("Error while loading contract. ", error);
    }
  };

  useEffect(() => {
    if (chainId && account && provider) {
      loadContract();
    }
  }, [chainId, account, provider]);
};

export default useLoadContract;
