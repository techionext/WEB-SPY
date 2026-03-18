export interface ISettings {
  id: string;
  structure: string[];
  typeProduct: string[];
  typePages: string[];
  createdAt: string;
  salesAngle: string[];
  supportPhone: string;
  lastUpdateAt: string;
  excludedPages: string[];
  excludedProducts: string[];
  email: string[];
  updatedAt: string;
}

export namespace ISettingsDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = ISettings;
}

export namespace IUpdateSettingsDTO {
  export type Args = {
    structure?: string[];
    typeProduct?: string[];
    typePages?: string[];
    salesAngle?: string[];
    supportPhone?: string;
    excludedPages?: string[];
    excludedProducts?: string[];
    email?: string[];
  };
  export type Result = {
    data: {
      id: string;
      structure: string[];
      typeProduct: string[];
      typePages: string[];
      createdAt: string;
      salesAngle: string[];
      supportPhone: string;
      lastUpdateAt: string;
      excludedPages: string[];
      excludedProducts: string[];
      email: string[];
      updatedAt: string;
    };
  };
}
