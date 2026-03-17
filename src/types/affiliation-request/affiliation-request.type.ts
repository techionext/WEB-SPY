export interface IAffiliationRequest {
  user: {
    name: string;
    id: string;
    email: string;
    avatar: {
      id: string;
      url: string;
    };
    createdAt: string;
    subscriptions: {
      plan: {
        id: string;
        title: string;
        price: number;
      };
    };
  };
  offer: {
    id: string;
    title: string;
    description: string;
    currency: string;
    platform: string;
    image: {
      id: string;
      url: string;
    };
    cpa: number;
  };
  mainPlan: {
    id: string;
    title: string;
    tag: string;
    price: number;
    cpa: number;
  };
  id: string;
  slug: string;
  email: string;
  snippet: string;
  dtcUrl: string;
  vslUrl: string;
  platformId: string;
  offerId: string;
  userId: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  approvedAt: string;
  rejectedAt: string;
  createdAt: string;
  updatedAt: string;
}

export namespace AffiliationMetricsDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
    offerId?: string[];
    userId?: string[];
    status?: string[];
    platform?: string[];
    currency?: string[];
  };
  export type Result = {
    totalRequests: number;
    totalApproved: number;
    totalRejected: number;
    totalPending: number;
  };
}

export namespace AffiliationRequestsDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
    offerId?: string[];
    userId?: string[];
    status?: string[];
    platform?: string[];
    currency?: string[];
  };
  export type Result = {
    data: IAffiliationRequest[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export namespace UpdateAffiliationRequestDTO {
  export type Args = {
    id: string;
    status?: string;
    snippet?: string | null;
    dtcUrl?: string | null;
    vslUrl?: string | null;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace AffiliationByIdDTO {
  export type Args = {
    id: string;
  };
  export type Result = IAffiliationRequest;
}
