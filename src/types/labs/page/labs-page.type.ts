export type ILabsPage = {
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

export namespace ICreateLabsPageDTO {
  export type Args = {
    type: string;
    url?: string;
    file?: File;
    title?: string;
    offerId: string;
  };
  export type Result = {
    id: string;
    codeIntern: string;
    message: string;
  };
}

export namespace ILabsPagesDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
    offerId?: string;
  };
  export type Result = {
    data: ILabsPage[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}
