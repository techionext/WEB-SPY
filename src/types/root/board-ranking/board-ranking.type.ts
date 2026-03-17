export type IBoardRanking = {
  totalRedeemed: number;
  totalUsers: number;
  redeem: boolean;
  reached: boolean;
  isCurrent: boolean;
  image: {
    id: string;
    url: string;
  };
  icon: {
    id: string;
    url: string;
  };
  id: string;
  title: string;
  description: string;
  value: number;
  createdAt: string;
  status: boolean;
};

export namespace IBoardRankingDTO {
  export type Args = {
    page?: string;
    pageSize?: string;
    filter?: string;
  };
  export type Result = {
    data: IBoardRanking[];
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}

export namespace IBoardRankingPostDTO {
  export type Args = {
    title: string;
    description?: string;
    value: number;
    image?: File;
    icon?: File;
  };
  export type Result = {
    id: string;
    codeIntern: string;
    message: string;
  };
}

export namespace IBoardRankingPutDTO {
  export type Args = {
    id: string;
    title?: string;
    description?: string;
    value?: number;
    image?: File;
    icon?: File;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IBoardRankingDeleteDTO {
  export type Args = {
    id: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IBoardRankingSummaryDTO {
  export type Args = void;
  export type Result = {
    totalRedeemed: number;
  };
}
