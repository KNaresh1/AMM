"use client";

import { useWeb3React } from "@web3-react/core";
import { useState } from "react";

export function useConnectWallet(selectedChainId: number) {
  const { connector, isActive, account } = useWeb3React();
  const [loading, setLoading] = useState(false);

  const [active, setActive] = useState<boolean>(isActive);

  const connectWallet = async () => {
    try {
      setLoading(true);

      await connector.activate({ chainId: selectedChainId });
      setActive(true);
    } catch (error) {
      console.error(`Error while connecting to wallet. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const deactivate = async () => {
    try {
      if (isActive) {
        await connector.deactivate?.();
        setActive(false);
      }
    } catch (error) {
      console.error(`Error while deactivating existing connection. ${error}`);
    }
  };

  return {
    connectWallet,
    deactivate,
    active,
    account,
    loading,
  };
}
