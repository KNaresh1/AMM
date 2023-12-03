import {
  Center,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Charts from "./Charts";
import Deposit from "./Deposit";
import Swap from "./Swap";
import Withdraw from "./Withdraw";

const ServicesTab = () => {
  return (
    <Center>
      <Tabs variant="solid-rounded" colorScheme="blue" size="md">
        <TabList justifyContent="center">
          <Tab>Swap</Tab>
          <Tab>Deposit</Tab>
          <Tab>Withdraw</Tab>
          <Tab>Charts</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Swap />
          </TabPanel>
          <TabPanel>
            <Deposit />
          </TabPanel>
          <TabPanel>
            <Withdraw />
          </TabPanel>
          <TabPanel>
            <Charts />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Center>
  );
};

export default ServicesTab;
