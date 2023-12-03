import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  NumberInput,
  NumberInputField,
  Select,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ShowAlert } from "../components";
import useContractStore from "../store";
import { formatUnits, loadBalances, parseUnits, swap } from "../utils";

const Swap = () => {
  const { account, provider } = useWeb3React();
  const [
    amm,
    symbols,
    tokens,
    balances,
    swapStatus,
    setSwapStatus,
    addBalances,
    addShares,
  ] = useContractStore((s) => [
    s.amm,
    s.symbols,
    s.tokens,
    s.balances,
    s.swapStatus,
    s.setSwapStatus,
    s.addBalances,
    s.addShares,
  ]);

  const [inputToken, setInputToken] = useState<string>();
  const [outputToken, setOutputToken] = useState<string>();
  const [inputAmount, setInputAmount] = useState<number>(0);
  const [outputAmount, setOutputAmount] = useState<string>("0.0");

  const [price, setPrice] = useState<number>(0);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    if (inputToken && outputToken) {
      getPrice();
    }
  }, [inputToken, outputToken]);

  const getPrice = async () => {
    if (inputToken === outputToken) {
      setPrice(0);
      return;
    }
    if (inputToken === symbols[0]) {
      setPrice((await amm.token2Balance()) / (await amm.token1Balance()));
    } else {
      setPrice((await amm.token1Balance()) / (await amm.token2Balance()));
    }
  };

  const enableSwap = () => {
    return (
      inputToken && outputToken && inputToken !== outputToken && inputAmount > 0
    );
  };

  const handleInputAmount = async (value: string) => {
    if (!value || value === "") {
      setInputAmount(0);
      setOutputAmount("0.0");
      return;
    }
    let result;
    setInputAmount(Number(value));

    if (inputToken === symbols[0]) {
      result = await amm.calculateToken1Swap(parseUnits(value));
      setOutputAmount(formatUnits(result.toString()));
    } else {
      result = await amm.calculateToken2Swap(parseUnits(value));
      setOutputAmount(formatUnits(result.toString()));
    }
  };

  const reset = () => {
    setInputAmount(0);
    setOutputAmount("0.0");
    setInputToken("");
    setOutputToken("");
  };

  const onSubmit = handleSubmit(async () => {
    const _inputAmount = parseUnits(inputAmount.toString());

    if (inputToken === symbols[0]) {
      await swap(
        provider,
        amm,
        tokens[0],
        inputToken,
        _inputAmount.toString(),
        setSwapStatus
      );
    } else if (inputToken === symbols[1]) {
      await swap(
        provider,
        amm,
        tokens[1],
        inputToken,
        _inputAmount.toString(),
        setSwapStatus
      );
    }
    await loadBalances(account, amm, tokens, addBalances, addShares);
    await getPrice();
    reset();
  });

  return (
    <Stack>
      <Card w={380} h={300} size="sm" alignItems="center">
        <CardBody>
          {account ? (
            <form onSubmit={onSubmit}>
              <Box mt={8}>
                <FormControl>
                  <Flex>
                    <Box flexDirection="column">
                      <FormLabel fontSize="sm">Input:</FormLabel>
                    </Box>
                    <Spacer />
                    <Box flexDirection="column">
                      <Text color="gray.500" opacity="0.8" fontSize="xs">
                        Balance:{" "}
                        {inputToken === symbols[0]
                          ? balances[0]
                          : inputToken === symbols[1]
                          ? balances[1]
                          : 0}
                      </Text>
                    </Box>
                  </Flex>
                </FormControl>
                <InputGroup>
                  <FormControl>
                    <NumberInput
                      w={220}
                      size="sm"
                      value={inputAmount}
                      onChange={handleInputAmount}
                    >
                      <NumberInputField
                        roundedLeft={8}
                        border="1px"
                        borderRight="0px"
                      />
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <Select
                      minWidth={0}
                      size="sm"
                      placeholder="Select Token"
                      roundedRight={8}
                      borderColor="black"
                      value={inputToken}
                      onChange={(e) => {
                        setInputToken(e.target.value);
                      }}
                    >
                      {symbols.map((symbol, index) => (
                        <option key={index} value={symbol}>
                          {symbol}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </InputGroup>
              </Box>
              <Box mt={6}>
                <FormControl>
                  <Flex>
                    <Box flexDirection="column">
                      <FormLabel fontSize="sm">Output:</FormLabel>
                    </Box>
                    <Spacer />
                    <Box flexDirection="column">
                      <Text color="gray.500" opacity="0.8" fontSize="xs">
                        Balance:{" "}
                        {outputToken === symbols[0]
                          ? balances[0]
                          : outputToken === symbols[1]
                          ? balances[1]
                          : 0}
                      </Text>
                    </Box>
                  </Flex>
                </FormControl>
                <InputGroup>
                  <FormControl>
                    <NumberInput
                      w={220}
                      size="sm"
                      isDisabled
                      value={outputAmount}
                    >
                      <NumberInputField
                        roundedLeft={8}
                        bgColor="gray.400"
                        border="1px"
                        borderRight="0px"
                      />
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <Select
                      minWidth={0}
                      size="sm"
                      placeholder="Select Token"
                      roundedRight={8}
                      borderColor="black"
                      value={outputToken}
                      onChange={(e) => setOutputToken(e.target.value)}
                    >
                      {symbols.map((symbol, index) => (
                        <option key={index} value={symbol}>
                          {symbol}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </InputGroup>
              </Box>
              <Button
                mt={6}
                mb={2}
                size="sm"
                width="100%"
                colorScheme="blue"
                isLoading={isSubmitting}
                loadingText="Swapping"
                isDisabled={!enableSwap()}
                type="submit"
              >
                Swap
              </Button>
              <Text color="gray.500" opacity="0.8" fontSize="xs">
                Exchange Rate: {price}
              </Text>
            </form>
          ) : (
            <Text align="center" my={90}>
              Please connect wallet
            </Text>
          )}
        </CardBody>
      </Card>
      <ShowAlert
        serviceType="Swap"
        status={swapStatus.status}
        transactionHash={swapStatus.transactionHash}
      />
    </Stack>
  );
};

export default Swap;
