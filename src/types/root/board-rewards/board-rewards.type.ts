export type IBoardRewards = {
  isRedeemed: boolean;
  totalRedeemed: number;
  totalUsers: number;
  image: {
    id: string;
    url: string;
  };
  id: string;
  title: string;
  subTitle: string;
  description: string;
  value: number;
  createdAt: string;
  updatedAt: string;
  status: boolean;
};

export namespace IBoardRewardsDTO {
  export type Args = {
    page?: string;
    pageSize?: string;
    filter?: string;
  };
  export type Result = {
    data: IBoardRewards[];
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}

export namespace IBoardRewardsPostDTO {
  export type Args = {
    title: string;
    description?: string;
    subTitle: string;
    value: number;
    image?: File;
  };
  export type Result = {
    id: string;
    codeIntern: string;
    message: string;
  };
}

export namespace IBoardRewardsPutDTO {
  export type Args = {
    id: string;
    title?: string;
    subTitle?: string;
    description?: string;
    value?: number;
    image?: File;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IBoardRewardsDeleteDTO {
  export type Args = {
    id: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IBoardRewardsSummaryDTO {
  export type Args = void;
  export type Result = {
    totalRedeemed: number;
  };
}
