import { Select } from "@chakra-ui/react";
import { useState } from "react";

const supportedNetworks = [
  { value: 31337, label: "Localhost" },
  { value: 11155111, label: "Sepolia" },
];

const SelectNetwork = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");

  const handleNetworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNetwork(event.target.value);
  };

  return (
    <div>
      <Select
        width={150}
        size="sm"
        value={selectedNetwork}
        onChange={handleNetworkChange}
      >
        <option value="" disabled>
          Select Network
        </option>
        {supportedNetworks.map((network) => (
          <option key={network.value} value={network.value}>
            {network.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default SelectNetwork;
