import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
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
import { loadBalances, parseUnits, removeLiquidity } from "../utils";

const Withdraw = () => {
  const { provider, account } = useWeb3React();

  const [
    amm,
    tokens,
    balances,
    shares,
    withdrawStatus,
    setWithdrawStatus,
    addBalances,
    addShares,
  ] = useContractStore((s) => [
    s.amm,
    s.tokens,
    s.balances,
    s.shares,
    s.withdrawStatus,
    s.setWithdrawStatus,
    s.addBalances,
    s.addShares,
  ]);
  const [amount, setAmount] = useState<number>(0);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const enableWithdraw = () => {
    return amount > 0;
  };

  const onSubmit = handleSubmit(async () => {
    await removeLiquidity(
      provider,
      amm,
      parseUnits(amount.toString()).toString(),
      setWithdrawStatus
    );
    await loadBalances(account, amm, tokens, addBalances, addShares);
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
                    Shares: {shares}
                  </Text>
                </FormControl>
                <InputGroup>
                  <FormControl>
                    <NumberInput w={240} min={1} size="sm">
                      <NumberInputField
                        roundedLeft={8}
                        border="1px"
                        borderRight="0px"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
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
                      w={82}
                      h={31.5}
                      roundedRight={8}
                      pointerEvents="none"
                      userSelect="none"
                    >
                      <Text alignSelf="center" mx={2}>
                        Shares
                      </Text>
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
                loadingText="Withdrawing"
                isDisabled={!enableWithdraw()}
                type="submit"
              >
                Withdraw
              </Button>
              <Divider
                borderBottomWidth="2px"
                mt={4}
                mb={4}
                borderColor="gray.300"
              />
              <Text my={4} fontSize="xs">
                <strong>DAPP Balance:</strong> {balances[0]}
              </Text>
              <Text fontSize="xs">
                <strong>USD Balance:</strong> {balances[1]}
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
        serviceType="Withdraw"
        status={withdrawStatus.status}
        transactionHash={withdrawStatus.transactionHash}
      />
    </Stack>
  );
};

export default Withdraw;
