export interface ClosedSalesReport {
  id: number;
  salesDate: Date;
  depositedAmount: number;
  depositedAccount: string;
  reporter: {
    id: number;
    name: string;
  };
  reportDate: Date;
  verified?: boolean;
  verifier?: {
    id: number;
    name: string;
  };
  verificationDate?: Date;
}
