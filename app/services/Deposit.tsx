import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  InputGroup,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useForm } from "react-hook-form";

const Deposit = () => {
  const { provider, account } = useWeb3React();

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    console.log("data...", data);
    const { token1, token2 } = data;
  });

  return (
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
                  Balance:
                </Text>
              </FormControl>
              <InputGroup>
                <FormControl>
                  <NumberInput defaultValue={0} min={0} w={260} size="sm">
                    <NumberInputField
                      roundedLeft={8}
                      border="1px"
                      borderRight="0px"
                      id="token1"
                      {...register("token1")}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="DAPP"
                    size="sm"
                    border="1px"
                    w={90}
                    roundedRight={8}
                    bgColor="gray.100"
                    isDisabled
                  />
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
                  Balance:
                </Text>
              </FormControl>
              <InputGroup>
                <FormControl>
                  <NumberInput defaultValue={0} min={1} w={260} size="sm">
                    <NumberInputField
                      roundedLeft={8}
                      border="1px"
                      borderRight="0px"
                      id="token2"
                      {...register("token2")}
                    />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="USD"
                    size="sm"
                    border="1px"
                    w={90}
                    roundedRight={8}
                    bgColor="gray.100"
                    isDisabled
                  />
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
  );
};

export default Deposit;
