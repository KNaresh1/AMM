"use client";

import { Box, Divider } from "@chakra-ui/react";
import useLoadContract from "./connect";
import ServicesTab from "./services";

export default function Home() {
  const { token } = useLoadContract();

  return (
    <Box>
      <Divider borderBottomWidth="1px" mt={4} mb={8} borderColor="gray.300" />
      {token && <ServicesTab />}
    </Box>
  );
}
