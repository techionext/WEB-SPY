export type IFinancesBalance = {
  protected: {
    available: {
      value: number;
      kpi: number;
    };
    pending: {
      value: number;
      kpi: number;
    };
  };
  balance: {
    total: {
      value: number;
      kpi: number;
    };
    available: {
      value: number;
      kpi: number;
    };
    pending: {
      value: number;
      kpi: number;
    };
    retained: {
      value: number;
      kpi: number;
    };
  };
};

export type IFinancesGraph = {
  graph: {
    revenue: number;
    profit: number;
    expense: number;
    date: string;
  }[];
};

export namespace IFinancesBalanceGetDTO {
  export type Args = {};
  export type Result = IFinancesBalance;
}

export namespace IFinancesGraphGetDTO {
  export type Args = {
    startDate: string;
    endDate: string;
  };
  export type Result = IFinancesGraph;
}
