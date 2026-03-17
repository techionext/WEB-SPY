export interface ISubscription {
  id: string;
  planExternalId: string;
  planName: string;
  status: "PAID" | "CHARGEBACK" | "REFUNDED";
  paidAt: string;
  paymentMethod: "PIX" | "CREDIT_CARD" | "BOLETO";
  value: number;
  valueNet: number;
  installments: number;
  chargebackAt: string;
  createdAt: string;
  updatedAt: string;
  hasRenewed: boolean;
}

export namespace ISubscriptionGetDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: ISubscription[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
