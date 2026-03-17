import { Swiper as SwiperType } from "swiper";
import { IUser } from "../user.type";

export type IRank = {
  redeem: boolean;
  reached: boolean;
  isCurrent: boolean;
  image: {
    id: string;
    url: string;
  };
  id: string;
  title: string;
  value: number;
  createdAt: string;
  updatedAt: string;
};

export type IAward = {
  isRedeemed: boolean;
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
};

export interface IRankCardProps {
  data: IRank;
}

export interface IAwardCardProps {
  data: IAward;
  index: number;
}

export interface IRanksSwiperProps {
  data: IRank[];
  isLoading: boolean;
  isFetching: boolean;
}

export interface IAwardsSwiperProps {
  data: IAward[];
  isLoading: boolean;
  isFetching: boolean;
}

export interface IAwardsControlsProps {
  controlledSwiper: SwiperType | null;
  user: IUser | null;
}

export namespace ILeaderboardDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: IRank[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export namespace IRewardsDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: IAward[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export namespace IRedeemRewardDTO {
  export type Args = {
    id: string;
  };
  export type Result = {
    message: string;
  };
}
