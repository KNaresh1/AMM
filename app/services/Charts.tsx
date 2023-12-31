import {
  Box,
  Card,
  Divider,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import Chart from "react-apexcharts";
import useContractStore from "../store";
import {
  formatDate,
  formatUnits,
  getSeries,
  loadAllSwaps,
  options,
  shortenAccount,
} from "../utils";

const Charts = () => {
  const { provider, account } = useWeb3React();

  const [amm, tokens, symbols, swaps, addSwaps, balances] = useContractStore(
    (s) => [s.amm, s.tokens, s.symbols, s.swaps, s.addSwaps, s.balances]
  );

  useEffect(() => {
    if (provider && amm) {
      loadAllSwaps(provider, amm, addSwaps);
    }
  }, [provider, amm, balances]);

  const getSymbol = (address: string) => {
    return address === tokens[0].address ? symbols[0] : symbols[1];
  };

  return (
    <Stack>
      <Card size="sm" alignItems="center">
        {account && amm ? (
          <Box border="1px" color="blue.600">
            <Box p={3}>
              <Chart
                options={options}
                series={getSeries(swaps, tokens)}
                type="line"
                height={300}
              />
            </Box>
            <Divider
              borderBottomWidth="1px"
              m={2}
              maxW="98%"
              borderColor="gray.300"
            />
            <Box p={3} maxWidth="100%" overflowY="auto">
              <Table size="sm" color="blue.600" variant="striped">
                <Thead>
                  <Tr>
                    <Th>Transaction Hash</Th>
                    <Th>Token Give</Th>
                    <Th>Amount Give</Th>
                    <Th>Token Get</Th>
                    <Th>Amount Get</Th>
                    <Th>User</Th>
                    <Th>Time</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {swaps
                    ?.sort((a, b) => b.args.timestamp - a.args.timestamp)
                    .map((s, index) => (
                      <Tr key={index}>
                        <Td>{shortenAccount(s.hash)}</Td>
                        <Td>{getSymbol(s.args.tokenGive)}</Td>
                        <Td>
                          {formatUnits(s.args.tokenGiveAmount.toString())}
                        </Td>
                        <Td>{getSymbol(s.args.tokenGet)}</Td>
                        <Td>{formatUnits(s.args.tokenGetAmount.toString())}</Td>
                        <Td>{shortenAccount(s.args.user)}</Td>
                        <Td>
                          {formatDate(
                            Number(s.args.timestamp.toString() + "000")
                          )}
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        ) : (
          <Text align="center" my={90}>
            Please connect wallet
          </Text>
        )}
      </Card>
    </Stack>
  );
};

export default Charts;
