import {
  Center,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

const ServicesTab = () => {
  return (
    <Center>
      <Tabs variant="enclosed" size="lg" width="40%">
        <TabList>
          <Tab>Swap</Tab>
          <Tab>Deposit</Tab>
          <Tab>Withdraw</Tab>
          <Tab>Charts</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>Swap</p>
          </TabPanel>
          <TabPanel>
            <p>Deposit</p>
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
