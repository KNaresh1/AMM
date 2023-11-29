import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useContractStore from "../store";
import { formatUnits, parseUnits, swap } from "../utils";

const Swap = () => {
  const { account, provider } = useWeb3React();
  const [amm, symbols, tokens, balances] = useContractStore((s) => [
    s.amm,
    s.symbols,
    s.tokens,
    s.balances,
  ]);

  const [inputToken, setInputToken] = useState<string>();
  const [outputToken, setOutputToken] = useState<string>();
  const [inputAmount, setInputAmount] = useState(0);
  const [outputAmount, setOutputAmount] = useState(0);

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
    if (inputToken === "DAPP") {
      setPrice((await amm.token2Balance()) / (await amm.token1Balance()));
    } else {
      setPrice((await amm.token1Balance()) / (await amm.token2Balance()));
    }
  };

  const canEnableSwap = () => {
    return (
      inputToken && outputToken && inputToken !== outputToken && inputAmount > 0
    );
  };

  const handleInputAmount = async (value: string) => {
    if (!inputToken || !outputToken) {
      window.alert("Please select token");
      return;
    }
    if (inputToken === outputToken) {
      window.alert("Invalid token pair");
      return;
    }
    let result;
    setInputAmount(Number(value));

    if (inputToken === "DAPP") {
      result = await amm.calculateToken1Swap(parseUnits(value));
      setOutputAmount(Number(formatUnits(result)));
    } else {
      result = await amm.calculateToken2Swap(parseUnits(value));
      setOutputAmount(Number(formatUnits(result)));
    }
  };

  const onSubmit = handleSubmit(() => {
    // const _inputAmount = Number(parseUnits(inputAmount.toString()));

    if (inputToken === symbols[0]) {
      swap(provider, amm, tokens[0], inputToken, inputAmount);
    } else if (inputToken === symbols[1]) {
      swap(provider, amm, tokens[1], inputToken, inputAmount);
    }
  });

  return (
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
                    min={1}
                    w={220}
                    size="sm"
                    value={inputAmount === 0 ? 0 : inputAmount}
                    onChange={handleInputAmount}
                  >
                    <NumberInputField
                      roundedLeft={8}
                      border="1px"
                      borderRight="0px"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
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
                    min={1}
                    w={220}
                    size="sm"
                    isDisabled
                    value={outputAmount === 0 ? 0 : outputAmount}
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
              isDisabled={!canEnableSwap()}
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
  );
};

export default Swap;
