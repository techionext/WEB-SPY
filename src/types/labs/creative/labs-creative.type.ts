export type ILabsCreative = {
  image: {
    id: string;
    url: string;
    mimeType: string;
    key: string;
  };
  id: string;
  title: string;
  description: string;
  language: string;
  isClimbing: boolean;
  trafficNetwork: string;
  salesAngle: string;
  creationType: string;
  offerId: string;
  status: boolean;
  pageId?: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export namespace ICreateLabsCreativeDTO {
  export type Args = {
    title: string;
    description: string;
    language: string;
    isClimbing: boolean;
    trafficNetwork: string;
    salesAngle: string;
    offerId: string;
    status: boolean;
    pageId?: string;
    creationType?: string;
    image?: File;
  };
  export type Result = {
    codeIntern: string;
    message: string;
    id: string;
  };
}

export namespace ILabsCreativesDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
    offerId?: string;
  };
  export type Result = {
    data: ILabsCreative[];
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}

export namespace IUpdateLabsCreativeDTO {
  export type Args = {
    id: string;
    title: string;
    description: string;
    language: string;
    isClimbing: boolean;
    trafficNetwork: string;
    salesAngle: string;
    offerId: string;
    status: boolean;
    pageId?: string;
    creationType?: string;
    image?: File;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}
