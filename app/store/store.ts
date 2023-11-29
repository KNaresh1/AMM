import { Contract } from "ethers";
import { StateCreator, create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

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
  shares: number;
  addAmmContract: (amm: Contract) => void;
}

const createAmmSlice: StateCreator<AmmSlice> = (set) => ({
  amm: {} as Contract,
  shares: 0,
  addAmmContract: (amm) => set(() => ({ amm })),
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
