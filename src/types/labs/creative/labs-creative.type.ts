export type ILabsCreative = {
  image: {
    id: string;
    url: string;
    mimeType: string;
    key: string;
  };
  id: string;
  title: string;
  offerId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export namespace ICreateLabsCreativeDTO {
  export type Args = {
    title: string;
    image?: File;
    offerId: string;
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
    offerId: string;
    title: string;
    image?: File;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}
