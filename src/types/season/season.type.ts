export interface ISeason {
  title: string;
  number: number;
  id: string;
  current: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export namespace IRankingSeasonDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
    seasonId: string;
  };
  export type Result = {
    data: Array<{
      name: string;
      placing: number;
      percentageNextPlacement: number;
      percentageTop: number;
      id: string;
      avatar: {
        id: string;
        url: string;
      };
      boardRanking?: {
        id: string;
        title: string;
        image?: { id: string; url: string };
        icon?: { id: string; url: string };
      };
    }>;
    user: {
      id: string;
      name: string;
      avatar: string;
      placing: number;
      percentageNextInvoicing: number;
      percentageTop: number;
      invoicing: number;
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
    };
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}

export namespace ISeasonDTO {
  export type Args = {
    id: string;
    page?: number;
    pageSize?: number;
  };
  export type Result = {
    data: ISeason[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export namespace ISeasonIdDTO {
  export type Args = {
    id: string;
  };
  export type Result = {
    data: ISeason;
  };
}
