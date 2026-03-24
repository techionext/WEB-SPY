import { TrafficNetwork } from "@/types/offer/offer.type";

export type IProcessStatus = "UPLOADING" | "PROCESSING" | "COMPLETED";

export type ILabsCreative = {
  id: string;
  title: string;
  description: string;
  language: string;
  isClimbing: boolean;
  trafficNetwork: TrafficNetwork;
  salesAngle: string;
  creationType: "AUTOMATIC" | "MANUAL";
  valueToday?: number;
  offer: {
    id: string;
    title: string;
    description: string;
    trafficNetwork: TrafficNetwork;
    structure: string;
    language: string;
    funnel: string;
    typeProduct: string;
    isClimbing: boolean;
    isCloaker: boolean;
    filter: string;
    image: {
      id: string;
      createdAt: string;
      updatedAt: string;
      offerId: string;
      url: string;
      urlOriginal: string;
      size: number;
      originalName: string;
      mimeType: string;
      key: string;
      keys: string[];
      userId: string;
      categoryId: string;
      creativeImageId: string;
      vslId: string;
      transcriptionVslId: string;
      processStatus: IProcessStatus;
      pageFileId: string;
      pageImageId: string;
    };
    category: {
      id: string;
      title: string;
      icon: string;
      image: {
        id: string;
        createdAt: string;
        updatedAt: string;
        offerId: string;
        url: string;
        urlOriginal: string;
        size: number;
        originalName: string;
        mimeType: string;
        key: string;
        keys: string[];
        userId: string;
        categoryId: string;
        creativeImageId: string;
        vslId: string;
        transcriptionVslId: string;
        processStatus: IProcessStatus;
        pageFileId: string;
        pageImageId: string;
      };
      createdAt: string;
      updatedAt: string;
    };
    adQuantity: number;
    viewsQuantity: number;
    pitch: string;
    createdAt: string;
    updatedAt: string;
  };
  category: {
    id: string;
    title: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
  };
  image: {
    id: string;
    createdAt: string;
    updatedAt: string;
    offerId: string;
    url: string;
    urlOriginal: string;
    size: number;
    originalName: string;
    mimeType: string;
    key: string;
    keys: [string];
    userId: string;
    categoryId: string;
    creativeImageId: string;
    vslId: string;
    transcriptionVslId: string;
    processStatus: IProcessStatus;
    pageFileId: string;
    pageImageId: string;
  };
  adQuantity: number;
  viewsQuantity: number;
  page: { id: string; title: string } | null;
  createdAt: string;
  updatedAt: string;
};

export namespace ICreateLabsCreativeDTO {
  export type Args = {
    title: string;
    description?: string;
    language: string;
    isClimbing: boolean;
    trafficNetwork: string;
    salesAngle?: string;
    offerId: string;
    status: boolean;
    pageId?: string;
    creationType?: string;
    valueToday?: number;
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
    trafficNetwork?: TrafficNetwork[];
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
    title?: string;
    description?: string;
    language?: string;
    isClimbing?: boolean;
    trafficNetwork?: string;
    salesAngle?: string;
    offerId: string;
    status?: boolean;
    pageId?: string;
    creationType?: string;
    valueToday?: number;
    image?: File;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace ILabsCreativeHistoryDTO {
  export type Args = {
    id: string;
    startDate?: string;
    endDate?: string;
  };
  export type Result = [
    {
      id: string;
      day: string;
      quantity: number;
      creativeId: string;
      createdAt: string;
      updatedAt: string;
    },
  ];
}

export namespace ICreateLabsCreativeHistoryDTO {
  export type Args = {
    id: string;
    day: string;
    quantity: number;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}
