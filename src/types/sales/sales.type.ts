export type ISalesRevenue = {
  valueGross: number;
  valueNet: number;
  averageTicket: string;
  totalSales: number;
  profitPercentage: string;
};

export type ISalesRevenueGraph = {
  valueGross: number;
  valueNet: number;
  totalSales: number;
  date: string;
};

export type ISalesProfit = {
  profit: number;
  marginNet: number;
  marginGross: number;
};

export type ISalesSubscription = {
  news: number;
  canceled: number;
  date: string;
};

export namespace ISalesRevenueGetDTO {
  export type Args = {
    startDate: string;
    endDate: string;
  };
  export type Result = ISalesRevenue;
}

export namespace ISalesRevenueGraphGetDTO {
  export type Args = {
    startDate: string;
    endDate: string;
  };
  export type Result = {
    data: ISalesRevenueGraph[];
    percentageAverageTicketEvolution: number;
    percentageSalesEvolution: number;
    percentageProfitEvolution: number;
    percentageValueGrossEvolution: number;
    percentageValueNetEvolution: number;
  };
}

export namespace ISalesProfitGetDTO {
  export type Args = {
    startDate: string;
    endDate: string;
  };
  export type Result = ISalesProfit;
}

export namespace ISalesSubscriptionGetDTO {
  export type Args = {
    startDate: string;
    endDate: string;
  };
  export type Result = {
    data: ISalesSubscription[];
    totalNewSubscriptions: number;
    totalActiveSubscriptions: number;
    totalCanceledSubscriptions: number;
    percentageNewSubscriptionsEvolution: string;
    percentageActiveSubscriptionsEvolution: string;
    percentageCanceledSubscriptionsEvolution: string;
  };
}

export type ISalesDistributionProduct = {
  id: string;
  externalId: string;
  title: string;
  value: number;
  amountSales: number;
  amountSalesPercentage: number;
  valuePercentage: number;
  expensePercentage: number;
  expense: number;
};

export namespace ISalesDistributionProductGetDTO {
  export type Args = {
    startDate: string;
    endDate: string;
  };
  export type Result = {
    data: ISalesDistributionProduct[];
  };
}
