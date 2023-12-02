export type STATUS_TYPE = "INITIAL" | "INPROGRESS" | "SUCCESS" | "ERROR";

export interface IStatus {
  status: STATUS_TYPE;
  transactionHash: string | undefined;
}
