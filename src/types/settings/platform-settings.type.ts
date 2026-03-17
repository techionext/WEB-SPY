export interface IPlataformSettings {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastUpdateAt: string;
  supportPhone: string;
  structure: string[];
  funnel: string[];
  typeProduct: string[];
  typePages: string[];
  excludedPages: string[];
  excludedProducts: string[];
  videoCategory: string[];
  email: string[];
}

export namespace IPlataformSettingsDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = IPlataformSettings;
}

export namespace IUpdatePlataformSettingsDTO {
  export type Args = {};
  export type Result = {
    structure: string[];
    funnel: string[];
    typeProduct: string[];
    typePages: string[];
    supportPhone: string;
    excludedPages: string[];
    excludedProducts: string[];
    email: string[];
  };
}
