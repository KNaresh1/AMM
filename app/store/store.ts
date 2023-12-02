import { Contract } from "ethers";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { StateCreator, create } from "zustand";
import { IStatus } from "../utils";

interface TokenSlice {
  symbols: string[];
  balances: string[];
  tokens: Contract[];
  addSymbols: (sybmols: string[]) => void;
  addTokenContracts: (tokens: Contract[]) => void;
  addBalances: (balances: string[]) => void;
}

const createTokenSlice: StateCreator<TokenSlice> = (set) => ({
  symbols: [],
  balances: ["", ""],
  tokens: [],
  addSymbols: (symbols) => set(() => ({ symbols })),
  addTokenContracts: (tokens) => set(() => ({ tokens })),
  addBalances: (balances) => set(() => ({ balances })),
});

interface AmmSlice {
  amm: Contract;
  swapStatus: IStatus;
  shares: number;
  depositStatus: IStatus;
  addAmmContract: (amm: Contract) => void;
  setSwapStatus: (swapStatus: IStatus) => void;
  setDepositStatus: (depositStatus: IStatus) => void;
}

const createAmmSlice: StateCreator<AmmSlice> = (set) => ({
  amm: {} as Contract,
  swapStatus: {
    status: "INITIAL",
    transactionHash: undefined,
  },
  depositStatus: {
    status: "INITIAL",
    transactionHash: undefined,
  },
  shares: 0,
  addAmmContract: (amm) => set(() => ({ amm })),
  setSwapStatus: (swapStatus) => set(() => ({ swapStatus })),
  setDepositStatus: (depositStatus) => set(() => ({ depositStatus })),
});

// CONTRACT STORE - MULTI STORE

const useContractStore = create<TokenSlice & AmmSlice>()((...a) => ({
  ...createTokenSlice(...a),
  ...createAmmSlice(...a),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("AMM Store", useContractStore);
}

export default useContractStore;
