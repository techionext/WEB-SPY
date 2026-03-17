export type IProducer = {
  avatar: {
    id: string;
    url: string;
    mimeType: string;
  };
  name: string;
  id: string;
  code: string;
  createdAt: string;
  updatedAt: string;
};

export namespace IProducerDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: IProducer[];
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}

export namespace ICreateProducerDTO {
  export type Args = {
    name: string;
    image?: File;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IUpdateProducerDTO {
  export type Args = {
    id: string;
    name: string;
    image?: File;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}
