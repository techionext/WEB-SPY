export type ISpyCreative = {
  offer: {
    id: string;
    title: string;
  };
  category: {
    id: string;
    title: string;
  };
  id: string;
  title: string;
  description: string;
  language: string;
  isClimbing: boolean;
  trafficNetwork: string;
  salesAngle: string;
  creationType: string;
  analysisTime: string;
  disabledStatus: string;
  status: boolean;
  createdAt: string;
  categoryId: string;
  transcriptionStatus: string;
  updatedHistory: boolean;
  viewsQuantity: number;
  image: {
    id: string;
    url: string;
    mimeType: string;
  };
  thumbnail: {
    id: string;
    url: string;
    mimeType: string;
  };
  totalCreatives: number;
};

export namespace ISpyCreativesDTO {
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
    offerId?: string;
  };
  export type Result = {
    data: ISpyCreative[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export type ISpyCreativeGrouped = {
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
  categoryTitles: [
    {
      type: string;
      quantity: number;
    },
  ];
  salesAngle: [
    {
      type: string;
      quantity: number;
    },
  ];
};
export namespace ISpyCreativeGroupedDTO {
  export type Args = {
    categoryTitles?: string[];
  };
  export type Result = ISpyCreativeGrouped;
}

export namespace ISpyCreativeTranscriptionDTO {
  export type Args = {
    id: string;
  };
  export type Result = {
    id: string;
    text: string;
    url: string;
    mimeType: string;
    codeIntern: string;
    message: string;
  };
}
