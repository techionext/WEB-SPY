export type ISpyCategory = {
  image: {
    url: string;
  };
  totalOffers: number;
  id: string;
  title: string;
  icon: string;
  createdAt: string;
};

export namespace ISpyCategoriesDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: ISpyCategory[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}
