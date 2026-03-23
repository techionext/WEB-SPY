import { TrafficNetwork } from "../offer/offer.type";

export type ISpyOffer = {
  isFavorite: boolean;
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
  image: {
    id: string;
    createdAt: string;
    updatedAt: string;
    categoryId: string;
    url: string;
    urlOriginal: string;
    size: number;
    originalName: string;
    mimeType: string;
    key: string;
    keys: string[];
    userId: string;
    offerId: string;
    creativeId: string;
    vslId: string;
    transcriptionVslId: string;
    processStatus: string;
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
      categoryId: string;
      url: string;
      urlOriginal: string;
      size: number;
      originalName: string;
      mimeType: string;
      key: string;
      keys: string[];
      userId: string;
      offerId: string;
      creativeId: string;
      vslId: string;
      transcriptionVslId: string;
      processStatus: string;
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

export type ISpyOfferById = {
  isFavorite: boolean;
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
    categoryId: string;
    url: string;
    urlOriginal: string;
    size: number;
    originalName: string;
    mimeType: string;
    key: string;
    keys: string[];
    userId: string;
    offerId: string;
    creativeId: string;
    vslId: string;
    transcriptionVslId: string;
    processStatus: string;
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
      categoryId: string;
      url: string;
      urlOriginal: string;
      size: number;
      originalName: string;
      mimeType: string;
      key: string;
      keys: string[];
      userId: string;
      offerId: string;
      creativeId: string;
      vslId: string;
      transcriptionVslId: string;
      processStatus: string;
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

export namespace ISpyOffersDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: ISpyOffer[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export type ISpyOfferGrouped = {
  language: [
    {
      type: string;
      quantity: number;
    },
  ];
  trafficNetwork: [
    {
      type: string;
      quantity: number;
    },
  ];
  typeProduct: [
    {
      type: string;
      quantity: number;
    },
  ];
  categoryTitles: [
    {
      type: string;
      quantity: number;
    },
  ];
  structure: [
    {
      type: string;
      quantity: number;
    },
  ];
};
export namespace ISpyOfferGroupedDTO {
  export type Args = {
    categoryTitles?: string[];
  };
  export type Result = ISpyOfferGrouped;
}

export namespace ISpyOfferFavoriteDTO {
  export type Args = {
    id: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace ISpyOfferDTOById {
  export type Args = {
    id: string;
  };
  export type Result = ISpyOfferById;
}

export namespace ISpyOfferByIdHistoryDTO {
  export type Args = {
    id: string;
    day?: string;
    quantity?: number;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export type ISpyVSL = {
  url: string;
  mimeType: string;
  transcriptionVsl: {
    id: string;
    text: string;
    url: string;
    mimeType: string;
    createdAt: string;
  };
  id: string;
  title: string;
  description: string;
  createdAt: string;
  transcriptionStatus: string;
};

export namespace ISpyVSLSDTO {
  export type Args = {
    offerId?: string;
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: ISpyVSL[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export namespace ISpyOfferUpdateDTO {
  export type Args = {
    id: string;
    title?: string;
    description?: string;
    trafficNetwork?: TrafficNetwork;
    structure?: string;
    language?: string;
    funnel?: string[];
    typeProduct?: string;
    isClimbing?: boolean;
    isCloaker?: boolean;
    filter?: string;
    image?: File;
    categoryId?: string;
    adQuantity?: number;
    viewsQuantity?: number;
    pitch?: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace ISpyOfferCreateDTO {
  export type Args = {
    title: string;
    description?: string;
    trafficNetwork: TrafficNetwork;
    structure: string;
    language: string;
    typeProduct: string;
    isClimbing: boolean;
    isCloaker: boolean;
    image?: File;
    categoryId: string;
    pitch?: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
    id: string;
    code: string;
  };
}
