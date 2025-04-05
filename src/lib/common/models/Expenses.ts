export interface ProcurementItem {
  id: number;
  date: Date;
  purchaser: {
    id: number;
    name: string;
  };
  vendor: {
    id: number;
    name: string;
  };
  description: string;
  hasReceipt?: boolean;
  purchaseTotal: number;
  fundSource:
    | {
        type: "DAILY_SALES";
        fromDate: Date;
      }
    | {
        type: "CHEQUE";
        chequeNumber: string;
      }
    | {
        type: "PETTY_CASH";
      };
}
