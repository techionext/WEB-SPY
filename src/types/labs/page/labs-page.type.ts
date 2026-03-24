export type ILabsPage = {
  file: {
    url: string;
    key: string;
    id: string;
  } | null;
  image: {
    id: string;
    url: string;
    key: string;
    mimeType: string;
  };
  id: string;
  url: string;
  type: string;
  title: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  typeAlert: "MISSING_INFORMATION" | "NONE" | string;
  imageLink: string;
  faviconLink: string;
  adQuantity: number;
  viewsQuantity: number;
  makeScraper: boolean;
  creativeCreateStatus: string;
  archive: boolean;
  archiveReason: string | null;
  archiveDate: string | null;
  creative: string | null;
  offer: string;
  createdAt: string;
  updatedAt: string;
};

export namespace ICreateLabsPageDTO {
  export type Args = {
    type: string;
    url?: string;
    description?: string;
    file?: File;
    image?: File;
    makeScraper?: boolean;
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
