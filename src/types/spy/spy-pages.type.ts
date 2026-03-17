export type ISpyPage = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  adQuantity: number;
  viewsQuantity: number;
  offer: {
    id: string;
    title: string;
  };
  url: string;
  archive: boolean;
  archiveReason: string;
  archiveDate: string;
  imageLink: string;
  faviconLink: string;
  makeScraper: boolean;
  file: {
    url: string;
    mimeType: string;
  };
  screenshot: {
    url: string;
    mimeType: string;
  };
  status: string;
  type: string;
};

export namespace ISpyPagesDTO {
  export type Args = {
    page?: number | string;
    pageSize?: number | string;
    filter?: string;
    offerId?: string;
    type?: string;
    comeGrouped?: boolean;
    trafficNetwork?: string[];
    structure?: string[];
    language?: string[];
    typeProduct?: string[];
    categoryTitles?: string[];
    isClimbing?: boolean;
    isCloaker?: boolean;
    startDate?: string;
    endDate?: string;
  };
  export type Result = {
    data: ISpyPage[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}
