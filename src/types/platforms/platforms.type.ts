export type IPlatform = {
  id: string;
  title: string;
  status: boolean;
  dispatchType: string;
  type: PlatformType;
  apiToken: string;
  slug: string;
  url: string;
  urlWithParams: string;
  emailAffiliate: string;
  createdAt: string;
  updatedAt: string;
  icon: {
    id: string;
    url: string;
    size: number;
    mimeType: string;
  };
  amountAccepted: number;
  amountRejected: number;
};

export enum PlatformType {
  BEMONY = "BEMONY",
  B4YOU = "B4YOU",
  BRAIP = "BRAIP",
  CARTPANDA = "CARTPANDA",
  NUTRALINK = "NUTRALINK",
  HOTMART = "HOTMART",
  KIRVANO = "KIRVANO",
  KIWIFY = "KIWIFY",
  LAST_LINK = "LAST_LINK",
  PAYT = "PAYT",
  DIGISTORE = "DIGISTORE",
  CLICK_BANK = "CLICK_BANK",
}

export interface IPlatformWebhook {
  id: string;
  event: string;
  status: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  platformsType: string;
  body: string;
}

export namespace ICreatePlatformDTO {
  export type Args = {
    title: string;
    platformToken?: string;
    type: PlatformType;
    apiToken?: string;
    emailAffiliate?: string;
    slug?: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
    id: string;
    url: string;
    urlWithParams: string;
  };
}

export namespace IPlatformsGetDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
    type?: PlatformType[];
  };
  export type Result = {
    data: IPlatform[];
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}

export namespace IPlatformsUpdateDTO {
  export type Args = {
    id: string;
    status?: boolean;
    title?: string;
    platformToken?: string;
    type?: PlatformType;
    apiToken?: string;
    emailAffiliate?: string;
    slug?: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IPlatformsDeleteDTO {
  export type Args = {
    id: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export interface IPlatformSettings {
  id: string;
  title: string;
  affiliateType: string;
  type: PlatformType | string;
  youtubeVideo: string | null;
  inPreparation: boolean;
  hasAffiliateEmail: boolean;
  hasPostBack: boolean;
  hasToken: boolean;
  hasSlug: boolean;
  hasApi: boolean;
  hasCoproducer?: boolean;
  meta: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
  icon: {
    id: string;
    url: string;
    size: number;
    mimeType: string;
  } | null;
}

export namespace IPlatformsSettingsGetDTO {
  export type Args = {};
  export type Result = {
    data: IPlatformSettings[];
  };
}

export namespace IPlatformsWebhooksGetDTO {
  export type Args = {
    id: string;
  };
  export type Result = IPlatformWebhook;
}

export type IPlatformsWebhooks = {
  status: string;
  id: string;
  code: string;
  event: string;
  createdAt: string;
  updatedAt: string;
  data: string;
};

export namespace IPlatformsWebhooksDTO {
  export type Args = {
    id: string;
    page?: number;
    pageSize?: number;
    filter?: string;
    status?: string;
    event?: string;
  };
  export type Result = {
    data: IPlatformsWebhooks[];
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}
