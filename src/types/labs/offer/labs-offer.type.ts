import { OfferPlatform } from "@/types/offer/offer.type";

export type TTrafficNetwork =
  | "FACEBOOK"
  | "YOUTUBE"
  | "TIKTOK"
  | "INSTAGRAM"
  | "GOOGLE"
  | "KWAI"
  | "OUTBRAIN"
  | "TABOOLA"
  | "SNAPCHAT";

export enum TrafficNetwork {
  FACEBOOK = "FACEBOOK",
  YOUTUBE = "YOUTUBE",
  TIKTOK = "TIKTOK",
  INSTAGRAM = "INSTAGRAM",
  GOOGLE = "GOOGLE",
  KWAI = "KWAI",
  OUTBRAIN = "OUTBRAIN",
  TABOOLA = "TABOOLA",
  SNAPCHAT = "SNAPCHAT",
}

type TrafficNetworkConfig = {
  label: string;
  icon: string;
};

export const trafficNetworkValues: Record<TrafficNetwork, TrafficNetworkConfig> = {
  [TrafficNetwork.FACEBOOK]: {
    label: "Facebook",
    icon: "logos:facebook",
  },
  [TrafficNetwork.YOUTUBE]: {
    label: "YouTube",
    icon: "logos:youtube-icon",
  },
  [TrafficNetwork.TIKTOK]: {
    label: "TikTok",
    icon: "logos:tiktok-icon",
  },
  [TrafficNetwork.INSTAGRAM]: {
    label: "Instagram",
    icon: "skill-icons:instagram",
  },
  [TrafficNetwork.GOOGLE]: {
    label: "Google",
    icon: "logos:google-icon",
  },
  [TrafficNetwork.KWAI]: {
    label: "Kwai",
    icon: "solar:global-bold-duotone",
  },
  [TrafficNetwork.OUTBRAIN]: {
    label: "Outbrain",
    icon: "solar:global-bold-duotone",
  },
  [TrafficNetwork.TABOOLA]: {
    label: "Taboola",
    icon: "solar:global-bold-duotone",
  },
  [TrafficNetwork.SNAPCHAT]: {
    label: "Snapchat",
    icon: "ic:baseline-snapchat",
  },
};

export type ILabsOffer = {
  isFavorite: boolean;
  hasAccess: boolean;
  totalVsl: number;
  totalCreatives: number;
  totalPages: number;
  mainPlan: {
    id: string;
    title: string;
    tag: string;
    price: number;
    cpa: number;
    url: string;
  };
  category: {
    id: string;
    title: string;
  };
  image: {
    id: string;
    url: string;
    key: string;
  };
  id: string;
  code: string;
  title: string;
  description: string;
  status: boolean;
  trafficNetwork: TTrafficNetwork;
  structure: string;
  language: string;
  funnel: string;
  typeProduct: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  totalClicks: number;
  affiliates: number;
  rating: number;
  pitch: string;
  platform: string;
  request?: {
    id: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
  };
  value: number;
  cpa: number;
  score: number;
  scoreLabel: "SCALING" | "POPULAR" | "TRENDING" | "GROWING" | "LOW";
};

export namespace ICreateLabsOfferDTO {
  export type Args = {
    title: string;
    description?: string;
    status: boolean;
    trafficNetwork: TTrafficNetwork;
    structure: string;
    language: string;
    typeProduct: string;
    categoryId: string;
    image?: File;
    pitch?: string;
    currency: string;
    externalId: string;
    value: number;
    cpa: number;
  };
  export type Result = {
    codeIntern: string;
    message: string;
    id: string;
    code: string;
  };
}

export namespace ILabsOfferDTO {
  export type Args = {
    isFavorite?: boolean;
    news?: boolean;
    isPopular?: boolean;
    categories?: string[];
    highestCPA?: boolean;
    myPlan?: boolean;
    page?: number;
    pageSize?: number;
    filter?: string;
    orderByType?:
      | "createdAt"
      | "recommended"
      | "scaling"
      | "highest-affiliates"
      | "opportunities"
      | "best"
      | "highest-CPA";
    orderBy?: "ASC" | "DESC";
    affiliateStatus?: string[];
    currency?: string[];
    platform?: string[];
    typeProduct?: string[];
    language?: string[];
    structure?: string[];
    trafficNetwork?: string[];
  };
  export type Result = {
    data: ILabsOffer[];
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}

export namespace IPostLabsOfferGroupedDTO {
  export type Args = {
    isFavorite?: boolean;
    categories?: string[];
    affiliateStatus?: string[];
    currency?: string[];
    platform?: string[];
    typeProduct?: string[];
    language?: string[];
    structure?: string[];
    trafficNetwork?: string[];
  };
  export type Result = {
    currency: Record<string, number>;
    platform: Record<string, number>;
    typeProduct: Record<string, number>;
    language: Record<string, number>;
    structure: Record<string, number>;
    trafficNetwork: Record<string, number>;
    category: Record<string, number>;
  };
}

export namespace IUpdateLabsOfferDTO {
  export type Args = {
    id: string;
    title: string;
    description?: string;
    status: boolean;
    trafficNetwork: TTrafficNetwork;
    structure: string;
    language: string;
    typeProduct: string;
    categoryId: string;
    image?: File;
    pitch?: string;
    currency?: string;
    platform: OfferPlatform;
    externalId?: string;
    value?: number;
    cpa?: number;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IGetLabsOfferByIdDTO {
  export type Args = {
    id: string;
  };
  export type Result = ILabsOffer;
}
