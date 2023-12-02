import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  InputGroup,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ShowAlert } from "../components";
import useContractStore from "../store";
import { addLiquidity, formatUnits, parseUnits } from "../utils";

const Deposit = () => {
  const { provider, account } = useWeb3React();

  const [amm, symbols, tokens, balances, depositStatus, setDepositStatus] =
    useContractStore((s) => [
      s.amm,
      s.symbols,
      s.tokens,
      s.balances,
      s.depositStatus,
      s.setDepositStatus,
    ]);

  const [token1Amount, setToken1Amount] = useState<number>(0);
  const [token2Amount, setToken2Amount] = useState<number>(0);

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm();

  const enableDeposit = () => {
    return token1Amount > 0 || token2Amount > 0;
  };

  const amount1Handler = async (value: string) => {
    setToken1Amount(Number(value));

    const result = await amm.calculateToken2Deposit(parseUnits(value));
    setToken2Amount(Number(formatUnits(result.toString())));
  };

  const amount2Handler = async (value: string) => {
    setToken2Amount(Number(value));

    const result = await amm.calculateToken1Deposit(parseUnits(value));
    setToken1Amount(Number(formatUnits(result.toString())));
  };

  const onSubmit = handleSubmit(async () => {
    const _token1Amount = parseUnits(token1Amount.toString()).toString();
    const _token2Amount = parseUnits(token2Amount.toString()).toString();

    await addLiquidity(
      provider,
      amm,
      tokens,
      [_token1Amount, _token2Amount],
      setDepositStatus
    );
  });

  return (
    <Stack>
      <Card w={380} h={300} size="sm" alignItems="center">
        <CardBody>
          {account ? (
            <form onSubmit={onSubmit}>
              <Box mt={8}>
                <FormControl>
                  <Text
                    color="gray.500"
                    opacity="0.8"
                    fontSize="xs"
                    align="right"
                    mb={2}
                  >
                    Balance: {balances[0]}
                  </Text>
                </FormControl>
                <InputGroup>
                  <FormControl>
                    <NumberInput
                      w={240}
                      min={1}
                      size="sm"
                      onChange={amount1Handler}
                      value={token1Amount}
                    >
                      <NumberInputField
                        roundedLeft={8}
                        border="1px"
                        borderRight="0px"
                        id="token1"
                        placeholder="0.0"
                        {...register("token1")}
                      />
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <Box
                      as="span"
                      display="inline-flex"
                      padding="2"
                      border="1px solid black"
                      borderRadius="sm"
                      fontSize="sm"
                      bgColor="gray.100"
                      w={84}
                      h={31.5}
                      roundedRight={8}
                      pointerEvents="none"
                      userSelect="none"
                    >
                      <Text alignSelf="center">DAPP</Text>
                    </Box>
                  </FormControl>
                </InputGroup>
              </Box>
              <Box mt={6}>
                <FormControl>
                  <Text
                    color="gray.500"
                    opacity="0.8"
                    fontSize="xs"
                    align="right"
                    mb={2}
                  >
                    Balance: {balances[1]}
                  </Text>
                </FormControl>
                <InputGroup>
                  <FormControl>
                    <NumberInput
                      w={240}
                      size="sm"
                      min={1}
                      value={token2Amount}
                      onChange={amount2Handler}
                    >
                      <NumberInputField
                        roundedLeft={8}
                        border="1px"
                        borderRight="0px"
                        id="token2"
                        placeholder="0.0"
                        {...register("token2")}
                      />
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <Box
                      as="span"
                      display="inline-flex"
                      padding="2"
                      border="1px solid black"
                      borderRadius="sm"
                      fontSize="sm"
                      bgColor="gray.100"
                      w={84}
                      h={31.5}
                      roundedRight={8}
                      pointerEvents="none"
                      userSelect="none"
                    >
                      <Text alignSelf="center">USD</Text>
                    </Box>
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
                loadingText="Depositing"
                isDisabled={!enableDeposit()}
                type="submit"
              >
                Deposit
              </Button>
            </form>
          ) : (
            <Text align="center" my={90}>
              Please connect wallet
            </Text>
          )}
        </CardBody>
      </Card>
      <ShowAlert
        serviceType="Deposit"
        status={depositStatus.status}
        transactionHash={depositStatus.transactionHash}
      />
    </Stack>
  );
};

export default Deposit;
