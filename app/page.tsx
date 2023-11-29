"use client";

import { Box, Divider } from "@chakra-ui/react";
import useLoadContract from "./connect";
import ServicesTab from "./services";

export default function Home() {
  useLoadContract();

  return (
    <Box>
      <Divider borderBottomWidth="2px" mt={4} mb={8} borderColor="gray.300" />
      <ServicesTab />
    </Box>
  );
}
