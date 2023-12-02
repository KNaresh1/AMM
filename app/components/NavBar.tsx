"use client";

import { Button, Flex, Select, Spacer, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import Blockies from "react-blockies";
import logo from "../../public/logo.png";
import { useConnectWallet } from "../connect";
import { shortenAccount } from "../utils";

const supportedNetworks = [
  { value: 31337, label: "Localhost" },
  { value: 11155111, label: "Sepolia" },
];

const NavBar = () => {
  const [selectedChainId, setSelectedChainId] = useState<number>(31337);
  const {
    account,
    active: isActive,
    loading: isConnecting,
    connectWallet,
    deactivate,
  } = useConnectWallet(selectedChainId);

  const handleChainChange = (newChainId: number) => {
    setSelectedChainId(newChainId);
    deactivate();
  };

  return (
    <Flex align="center" gap="3">
      <Image src={logo} alt="Logo" style={{ width: "40px", height: "40px" }} />
      <Text fontSize="lg" fontWeight="bold">
        DApp AMM
      </Text>
      <Spacer />
      <Select
        width={150}
        size="sm"
        value={selectedChainId}
        onChange={(e) => handleChainChange(Number(e.target.value))}
      >
        <option value="0" disabled>
          Select Network
        </option>
        {supportedNetworks.map((network, index) => (
          <option key={index} value={network.value}>
            {network.label}
          </option>
        ))}
      </Select>
      {isActive && account ? (
        <>
          <Text fontSize="md">{shortenAccount(account)}</Text>
          <Blockies seed={account} />
        </>
      ) : selectedChainId ? (
        <Button
          colorScheme="blue"
          size="sm"
          isLoading={isConnecting}
          loadingText={"Connecting"}
          onClick={() => connectWallet()}
        >
          Connect Wallet
        </Button>
      ) : (
        <></>
      )}
    </Flex>
  );
};

export default NavBar;
