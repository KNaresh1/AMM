import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { useEffect } from "react";

import AMM_ABI from "../abis/AMM.json";
import TOKEN_ABI from "../abis/Token.json";
import config from "../config.json";
import useContractStore from "../store";
import { formatUnits } from "../utils/utils";

const useLoadContract = () => {
  const { provider, account } = useWeb3React();

  const [addTokenContracts, addSymbols, addBalances, addAmmContract] =
    useContractStore((s) => [
      s.addTokenContracts,
      s.addSymbols,
      s.addBalances,
      s.addAmmContract,
    ]);

  const loadContract = async () => {
    try {
      if (provider) {
        // TOKENS
        const dapp = new Contract(
          config[31337].dapp.address,
          TOKEN_ABI,
          provider
        );
        const usd = new Contract(
          config[31337].usd.address,
          TOKEN_ABI,
          provider
        );
        addTokenContracts([dapp, usd]);
        addSymbols([await dapp.symbol(), await usd.symbol()]);

        const balance1 = await dapp.balanceOf(account);
        const balance2 = await usd.balanceOf(account);
        addBalances([formatUnits(balance1), formatUnits(balance2)]);

        // AMM
        const amm = new Contract(config[31337].amm.address, AMM_ABI, provider);
        addAmmContract(amm);
      }
    } catch (error) {
      console.error("Error while loading contract. ", error);
    }
  };

  useEffect(() => {
    if (account) {
      loadContract();
    }
  }, [account, provider]);
};

export default useLoadContract;
