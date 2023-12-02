"use client";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  Divider,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { STATUS_TYPE } from "../utils";

interface AlertProps {
  serviceType: string;
  status: STATUS_TYPE;
  transactionHash: string | undefined;
}

const ShowAlert = ({ serviceType, status, transactionHash }: AlertProps) => {
  const [alertStatus, setAlertStatus] = useState<string>();

  useEffect(() => {
    setAlertStatus(status);
  }, [status]);

  const handleClose = () => {
    setAlertStatus("CLOSE");
  };

  return (
    <div>
      {alertStatus === "INPROGRESS" && (
        <Alert status="info" mt={3} color="blue.700">
          <AlertIcon />
          <AlertTitle fontWeight="md">{serviceType} Pending...</AlertTitle>
          <Spacer />
          <CloseButton onClick={handleClose} />
        </Alert>
      )}
      {alertStatus === "SUCCESS" && (
        <Alert status="success" flexDirection="column" mt={3} color="green.700">
          <Flex>
            <AlertIcon />
            <AlertTitle fontWeight="md">{serviceType} Successful</AlertTitle>
            <Spacer />
            <CloseButton
              position="absolute"
              right="8px"
              top="6px"
              onClick={handleClose}
            />
          </Flex>
          <Divider borderBottomWidth="1px" m={3} borderColor="gray.400" />
          <AlertDescription alignSelf="flex-start" fontSize="sm">
            Transaction Hash: {transactionHash}
          </AlertDescription>
        </Alert>
      )}
      {alertStatus === "ERROR" && (
        <Alert status="error" mt={3} color="red.700">
          <AlertIcon />
          <AlertTitle fontWeight="md">{serviceType} Failed</AlertTitle>
          <Spacer />
          <CloseButton onClick={handleClose} />
        </Alert>
      )}
    </div>
  );
};

export default ShowAlert;
