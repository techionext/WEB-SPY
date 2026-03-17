export enum Recurrence {
  DAILY,
  WEEKLY,
  FORTNIGHTLY,
  MONTHLY,
  BIMONTHLY,
  QUARTERLY,
  SEMI_ANNUALLY,
  ANNUALLY,
}

export interface IPlan {
  id: string;
  isFree: boolean;
  title: string;
  description: string;
  tag: string;
  features: string[];
  price: number;
  isActive: boolean;
  isArchived: boolean;
  isHighlight: boolean;
  recurrence: Recurrence;
  createdAt: string;
  updatedAt: string;
}

export namespace IPlanGetDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: IPlan[];
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}
