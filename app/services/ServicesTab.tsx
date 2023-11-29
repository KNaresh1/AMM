import {
  Center,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Deposit from "./Deposit";
import Swap from "./Swap";

const ServicesTab = () => {
  return (
    <Center>
      <Tabs variant="solid-rounded" colorScheme="blue" size="md">
        <TabList>
          <Tab>Swap</Tab>
          <Tab>Deposit</Tab>
          <Tab>Withdraw</Tab>
          <Tab>Charts</Tab>
        </TabList>
        <TabPanels w={400}>
          <TabPanel>
            <Swap />
          </TabPanel>
          <TabPanel>
            <Deposit />
          </TabPanel>
          <TabPanel>
            <p>Withdraw</p>
          </TabPanel>
          <TabPanel>
            <p>Charts</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Center>
  );
};

export default ServicesTab;
