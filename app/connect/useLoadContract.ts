import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { useEffect, useState } from "react";

import TOKEN_ABI from "../abis/Token.json";
import config from "../config.json";

const useLoadContract = () => {
  const [token, setToken] = useState<Contract>();

  const { provider, account } = useWeb3React();
  const [loading, setLoading] = useState(false);

  const loadContract = async () => {
    try {
      setLoading(true);

      if (provider) {
        const token = new Contract(
          config[31337].token.address,
          TOKEN_ABI,
          provider
        );
        setToken(token);
      }
    } catch (error) {
      console.error("Error while loading contract. ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      loadContract();
    }
  }, [account, provider]);

  return { token, loading };
};

export default useLoadContract;
