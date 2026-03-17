export namespace IRankingGlobalDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: [
      {
        name: string;
        placing: number;
        percentageNextPlacement: number;
        percentageTop: number;
        id: string;
        avatar: {
          id: string;
          url: string;
        };
        boardRanking: {
          id: string;
          title: string;
          image: {
            id: string;
            url: string;
          };
          icon: {
            id: string;
            url: string;
          };
        };
      },
    ];
    user: {
      id: string;
      name: string;
      avatar: string;
      placing: number;
      percentageNextInvoicing: number;
      percentageTop: number;
      invoicing: number;
      boardRanking: {
        image: {
          id: string;
          url: string;
        };
        id: string;
        createdAt: string;
        updatedAt: string;
        status: true;
        title: string;
        description: string;
        value: number;
        totalUsers: number;
      };
    };
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}
