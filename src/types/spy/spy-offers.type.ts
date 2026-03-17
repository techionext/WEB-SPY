export type ISpyOffer = {
  type: string;
  page: [
    {
      id: string;
      url: string;
      adQuantity: number;
    },
  ];
  category: {
    id: string;
    title: string;
  };
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  trafficNetwork: string;
  structure: string;
  language: string;
  funnel: string[];
  typeProduct: string;
  isClimbing: boolean;
  isCloaker: boolean;
  isFavorite: boolean;
  isPopular: boolean;
  adQuantity: number;
  viewsQuantity: number;
  pitch: string;
  image: {
    id: string;
    url: string;
    mimeType: string;
  };
  creative: [
    {
      id: string;
      title: string;
      viewsQuantity: number;
    },
  ];
};

export type ISpyOfferById = {
  id: string;
  code: string;
  url: string;
  type: string;
  status: boolean;
  title: string;
  description: string;
  isClimbing: boolean;
  isCloaker: boolean;
  trafficNetwork: string;
  structure: string;
  language: string;
  typeProduct: string;
  funnel: string[];
  totalClicks: number;
  adQuantity: number;
  createdAt: string;
  updatedAt: string;
  viewsQuantity: number;
  disabledStatus: string;
  analysisTime: string;
  pitch: string;
  category: {
    id: string;
    title: string;
  };
  todayQuantity: number;
  amountCreative: number;
  amountPages: number;
  amountVsl: number;
  image: {
    id: string;
    url: string;
    mimeType: string;
  };
};

export namespace ISpyOffersDTO {
  export type Args = {
    trafficNetwork?: string[];
    structure?: string[];
    language?: string[];
    typeProduct?: string[];
    categoryTitles?: string[];
    isClimbing?: boolean;
    isCloaker?: boolean;
    startDate?: string;
    endDate?: string;
    hasVideo?: boolean;
    orderByType?: string;
    orderBy?: string;
    page?: number;
    pageSize?: number;
    filter?: string;
    isFavorite?: boolean;
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
    startDate?: string;
    endDate?: string;
  };
  export type Result = Array<{
    date: string;
    quantity: number;
  }>;
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

export namespace ISpyVSLDownloadDTO {
  export type Args = {
    id: string;
  };
  export type Result = {
    url: string;
  };
}

export type ISpyQuizStep = {
  image: {
    url: string;
  };
  id: string;
  index: number;
};

export type ISpyQuiz = {
  video: {
    url: string;
  };
  steps: ISpyQuizStep[];
  id: string;
  url: string;
  urlIsActive: boolean;
  createdAt: string;
};

export namespace ISpyQuizDTO {
  export type Args = {
    id: string;
  };
  export type Result = ISpyQuiz;
}
