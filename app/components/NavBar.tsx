"use client";

import { Button, Flex, Spacer, Text } from "@chakra-ui/react";
import Image from "next/image";
import Blockies from "react-blockies";
import logo from "../../public/logo.png";
import { useConnectWallet } from "../connect";
import SelectNetwork from "./SelectNetwork";

const NavBar = () => {
  const { account, loading: isConnecting, connectWallet } = useConnectWallet();

  return (
    <Flex align="center" gap="3">
      <Image src={logo} alt="Logo" style={{ width: "40px", height: "40px" }} />
      <Text fontSize="lg" fontWeight="bold">
        DApp AMM
      </Text>
      <Spacer />
      <SelectNetwork />
      {account ? (
        <>
          <Text fontSize="md">
            {account.substring(0, 6)}...${account.substring(account.length - 4)}
          </Text>
          <Blockies seed={account} />
        </>
      ) : (
        <Button
          colorScheme="blue"
          size="sm"
          isLoading={isConnecting}
          onClick={() => connectWallet()}
        >
          Connect Wallet
        </Button>
      )}
    </Flex>
  );
};

export default NavBar;
