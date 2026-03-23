import { PlatformType } from "../platforms/platforms.type";

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

type TrafficNetworkConfig = {
  label: string;
  icon: string;
};

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

export type IOffer = {
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
  trafficNetwork: string;
  structure: string;
  language: string;
  funnel: string;
  typeProduct: string;
  isClimbing: boolean;
  isCloaker: boolean;
  createdAt: string;
  updatedAt: string;
  totalClicks: number;
  affiliates: number;
  rating: number;
  pitch: string;
  isFavorite: boolean;
};

export namespace IOfferDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: IOffer[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export enum OfferPlatform {
  CARTPANDA = "CARTPANDA",
  CLICK_BANK = "CLICK_BANK",
}

export const platformValues: Record<string, string> = {
  [OfferPlatform.CARTPANDA]: "Cartpanda",
  [OfferPlatform.CLICK_BANK]: "Click Bank",
};

export type IOfferRequest = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  email: string;
  offerId: string;
  userId: string;
  slug: string;
  snippet: string;
  dtcUrl: string;
  vslUrl: string;
  platformId: string;
  approvedAt: string;
  rejectedAt: string;
};

export type IOfferById = {
  currency: string;
  externalId: string;
  value: number;
  cpa: number;
  totalVsl: number;
  totalCreatives: number;
  totalPages: number;
  _count: {
    pages: number;
    creatives: number;
    vsl: number;
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
  isPopular: boolean;
  isFavorite: boolean;
  trafficNetwork:
    | "FACEBOOK"
    | "YOUTUBE"
    | "TIKTOK"
    | "INSTAGRAM"
    | "GOOGLE"
    | "KWAI"
    | "OUTBRAIN"
    | "TABOOLA"
    | "SNAPCHAT";
  structure: string;
  mainPlan: {
    id: string;
    title: string;
    tag: string;
    price: number;
    cpa: number;
    url: string;
  };
  language: string;
  funnel: string;
  typeProduct: string;
  isClimbing: boolean;
  isCloaker: boolean;
  createdAt: string;
  updatedAt: string;
  totalClicks: number;
  affiliates: number;
  rating: number;
  pitch: string;
  request?: IOfferRequest;
  platform: {
    image: {
      id: string;
      url: string;
      mimeType: string;
      size: string;
    };
    type: PlatformType;
  };
};

export namespace IOfferDTOById {
  export type Args = {
    id: string;
  };
  export type Result = IOfferById;
}

export type ILabsVsl = {
  transcriptionVsl: {
    id: string;
    text: string;
    url: string;
    key: string;
  };
  video: {
    id: string;
    url: string;
    key: string;
  };
  id: string;
  title: string;
  description: string;
  offerId: string;
  createdAt: string;
  updatedAt: string;
};
export namespace ILabsVslDTO {
  export type Args = {
    offerId?: string;
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: ILabsVsl[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export type ILabsCreatives = {
  image: {
    id: string;
    url: string;
    key: string;
    mimeType: string;
  };
  id: string;
  title: string;
  offerId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};
export namespace ILabsCreativesDTO {
  export type Args = {
    offerId?: string;
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: ILabsCreatives[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export type ILabsPages = {
  file: {
    url: string;
    key: string;
    id: string;
  };
  image: {
    id: string;
    url: string;
    key: string;
  };
  id: string;
  url: string;
  type: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  offerId: string;
};
export namespace ILabsPagesDTO {
  export type Args = {
    offerId?: string;
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: ILabsPages[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export namespace IUpdateLabsPageDTO {
  export type Args = {
    id: string;
    url?: string;
    type: string;
    file?: File;
    title?: string;
    image?: File;
    offerId: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IFavoriteLabsOfferDTO {
  export type Args = {
    id: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export type IGetLabsOfferSimple = {
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
  currency: string;
  platform: OfferPlatform;
  trafficNetwork: TrafficNetwork;
  structure: string;
  language: string;
  funnel: string;
  typeProduct: string;
  createdAt: string;
  updatedAt: string;
  totalClicks: number;
  affiliates: number;
  rating: number;
  pitch: string;
};
export namespace IGetLabsOfferSimpleDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: IOffer[];
  };
}
export namespace IAffiliateLabsOfferDTO {
  export type Args = {
    offerId: string;
    platformId: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}
