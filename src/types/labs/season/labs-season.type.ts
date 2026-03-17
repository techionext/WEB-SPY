export interface ILabsSeason {
  image?: {
    id: string;
    url: string;
  };
  id: string;
  title: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export namespace ILabsSeasonDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: ILabsSeason[];
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}
