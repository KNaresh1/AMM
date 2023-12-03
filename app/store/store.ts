import { Contract } from "ethers";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { StateCreator, create } from "zustand";
import { IStatus, ISwapHistory } from "../utils";

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
  swaps: ISwapHistory[];
  swapStatus: IStatus;
  depositStatus: IStatus;
  withdrawStatus: IStatus;
  addAmmContract: (amm: Contract) => void;
  addShares: (shares: number) => void;
  addSwaps: (swaps: ISwapHistory[]) => void;
  setSwapStatus: (swapStatus: IStatus) => void;
  setDepositStatus: (depositStatus: IStatus) => void;
  setWithdrawStatus: (withdrawStatus: IStatus) => void;
}

const createAmmSlice: StateCreator<AmmSlice> = (set) => ({
  amm: {} as Contract,
  shares: 0,
  swaps: [],
  swapStatus: {
    status: "INITIAL",
    transactionHash: undefined,
  },
  depositStatus: {
    status: "INITIAL",
    transactionHash: undefined,
  },
  withdrawStatus: { status: "INITIAL", transactionHash: undefined },
  addAmmContract: (amm) => set(() => ({ amm })),
  addShares: (shares) => set(() => ({ shares })),
  addSwaps: (swaps) => set(() => ({ swaps })),
  setSwapStatus: (swapStatus) => set(() => ({ swapStatus })),
  setDepositStatus: (depositStatus) => set(() => ({ depositStatus })),
  setWithdrawStatus: (withdrawStatus) => set({ withdrawStatus }),
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
