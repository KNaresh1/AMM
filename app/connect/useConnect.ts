"use client";

import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useEffect, useState } from "react";

const injectedConnector = new InjectedConnector({
  supportedChainIds: [31337],
});

export function useConnectWallet() {
  const { connector, isActive, account } = useWeb3React();
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setLoading(true);
      await connector.activate(injectedConnector);
    } catch (error) {
      console.error(`Error while connecting to wallet. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    connectWallet,
    isActive,
    account,
    loading,
  };
}

export function useInactiveListener(suppress: boolean = false) {
  const { isActive, connector } = useWeb3React();
  const { activate } = connector;

  useEffect((): any => {
    const { ethereum } = window as any;

    if (ethereum && ethereum.on && !isActive && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injectedConnector);
      };

      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          activate(injectedConnector);
        }
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, [isActive, suppress, activate]);
}
