import config from "./config.json";

interface ChainConfig {
  dappTokenAddress: string;
  usdTokenAddress: string;
  ammAddress: string;
}

interface AppConfig {
  chains: Record<string, ChainConfig>;
}

const appConfig: AppConfig = config;

export default appConfig;
