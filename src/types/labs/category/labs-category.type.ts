export interface ILabsCategory {
  offers: number;
  _count: {
    offers: number;
  };
  image: {
    id: string;
    url: string;
  };
  id: string;
  title: string;
  icon: string;
  score: number;
  scoreLabel: "SCALING" | "TRENDING" | "POPULAR" | "GROWING" | "LOW";
  bestCPA: number;
  totalClicks: number;
  totalAffiliates: number;
  createdAt: string;
  updatedAt: string;
}

export namespace ILabsCategoryDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
    orderByType?:
      | "createdAt"
      | "best"
      | "highest-sales"
      | "highest-revenue"
      | "highest-affiliates"
      | "highest-CPA";
    orderBy?: "ASC" | "DESC";
  };
  export type Result = {
    data: ILabsCategory[];
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}

export namespace ICreateLabsCategoryDTO {
  export type Args = {
    title: string;
    icon?: string;
    image?: File;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IUpdateLabsCategoryDTO {
  export type Args = {
    id: string;
    title: string;
    icon: string;
    image: File;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IGetLabsCategoryRankingDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
    orderByType?: "affiliates" | "clicks" | "offers";
    orderBy?: "asc" | "desc";
  };
  export type Result = {
    data: [
      {
        id: string;
        title: string;
        icon: string;
        image: {
          id: string;
          url: string;
        };
        affiliates: number;
        clicks: number;
        offers: number;
        scoreLabel: "scaling" | "trending" | "popular" | "growing" | "low";
        cpa: number;
      },
    ];
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}
