export interface IUser {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: {
    country: string;
    ddd: string;
    number: string;
  };
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  emailStatus: "VERIFIED" | "NOT_VERIFIED";
  platformRole: "USER" | "ROOT" | "ADMIN" | "INSIDER";
  createdAt: string;
  updatedAt: string;
  nextBoard: {
    image: {
      id: string;
      url: string;
    };
    status: boolean;
    percentage: number;
    value: number;
    description: string;
    title: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    totalUsers: number;
  };
  nextReward: {
    image: {
      id: string;
      url: string;
    };
    percentage: number;
    status: boolean;
    value: number;
    description: string;
    title: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    subTitle: string;
    totalUsers: number;
  };
  subscription: {
    lastPayment: {
      status: "PAID" | "CHARGEBACK" | "REFUNDED";
      value: number;
      id: string;
      createdAt: string;
      updatedAt: string;
      planExternalId: string;
      planName: string;
      paidAt: string;
      paymentMethod: "PIX" | "CREDIT_CARD" | "BOLETO";
      valueNet: number;
      installments: number;
      chargebackAt: string;
      subscriptionsId: string;
      hasRenewed: true;
    };
    nextPayment: {
      status: "PAID" | "CHARGEBACK" | "REFUNDED";
      value: number;
      id: string;
      createdAt: string;
      updatedAt: string;
      planExternalId: string;
      planName: string;
      paidAt: string;
      paymentMethod: "PIX" | "CREDIT_CARD" | "BOLETO";
      valueNet: number;
      installments: number;
      chargebackAt: string;
      subscriptionsId: string;
      hasRenewed: true;
    };
    plan: {
      description: string;
      title: string;
      id: string;
      createdAt: string;
      updatedAt: string;
      isFree: true;
      tag: string;
      features: [string];
      price: number;
      isActive: true;
      isArchived: true;
      isHighlight: true;
      recurrence:
        | "DAILY"
        | "WEEKLY"
        | "FORTNIGHTLY"
        | "MONTHLY"
        | "BIMONTHLY"
        | "QUARTERLY"
        | "SEMI_ANNUALLY"
        | "ANNUALLY";
    };
    status: "ACTIVE" | "PENDING" | "CANCELLED";
    value: number;
    id: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    externalId: string;
    startDate: string;
    endDate: string;
    recurrency:
      | "DAILY"
      | "WEEKLY"
      | "FORTNIGHTLY"
      | "MONTHLY"
      | "BIMONTHLY"
      | "QUARTERLY"
      | "SEMI_ANNUALLY"
      | "ANNUALLY";
    expiredAt: string;
    canceledAt: string;
    cancellationReason: string;
  };
  invoicing: number;
  visibility: "PUBLIC" | "PRIVATE";
  rankingName: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  document: string;
  documentType: "CPF" | "CNPJ";
  avatar: {
    id: string;
    url: string;
  };
  actualBoard: {
    id: string;
    title: string;
    value: number;
    image: {
      id: string;
      url: string;
    };
    percentage: number;
  };
  actualReward: {
    percentage: number;
    id: string;
    title: string;
    subTitle: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    value: number;
    image: {
      id: string;
      url: string;
    };
  };
  securitySettings: {
    allowedMethods: {
      email: true;
      phone: true;
      authenticator: true;
    };
    defaultMethod: "EMAIL" | "PHONE" | "AUTHENTICATOR";
    scopes: {
      needed: {
        login: true;
        passwordChange: true;
      };
      valid: {
        login: string;
        passwordChange: string;
      };
    };
  };
  marketingConfigured: boolean;
  salePlatformConfigured: boolean;
  rankingGlobal: {
    percentageNextInvoicing: number;
    percentageTop: number;
    placing: number;
  };
  rankingSeason: {
    percentageNextInvoicing: number;
    percentageTop: number;
    placing: number;
  };
}

export interface IGetUser {
  avatar: {
    id: string;
    url: string;
  };
  number: string;
  name: string;
  id: string;
  code: string;
  email: string;
  phone: {
    country: string;
    ddd: string;
    number: string;
  };
  invoicing: number;
  status: string;
  emailStatus: string;
  platformRole: string;
  visibility: string;
  rankingName: string;
  street: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  document: string;
  documentType: string;
  createdAt: string;
  updatedAt: string;
  boardRankingId: string;
}
export namespace IGetUsersDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: IGetUser[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export namespace IUserInviteDTO {
  export type Args = {
    name: string;
    email: string;
    phone?: {
      country: string;
      ddd: string;
      number: string;
    };
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IUserPutDTO {
  export type Args = {
    id: string;
    name?: string;
    phone?: {
      country: string;
      ddd: string;
      number: string;
    };
    document?: string;
    documentType?: "CPF" | "CNPJ";
    street?: string;
    number?: string;
    complement?: string;
    district?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    rankingName?: string;
    visibility?: "PUBLIC" | "PRIVATE";
    status?: "ACTIVE" | "INACTIVE" | "BANNED";
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export interface IUserById {
  boardRanking: {
    id: string;
    value: number;
    title: string;
    image: {
      id: string;
      url: string;
    };
  };
  boardReward: {
    id: string;
    createdAt: string;
    updatedAt: string;
    value: number;
    description: string;
    title: string;
    image: {
      id: string;
      url: string;
    };
    subTitle: string;
  };
  balance: {
    value: number;
    commission: number;
    count: number;
    aov: number;
  };
  rankingGlobal: {
    placing: number;
    percentageNextInvoicing: number;
    percentageTop: number;
  };
  rankingSeason: {
    placing: number;
    percentageNextInvoicing: number;
    percentageTop: number;
  };
  affiliationRequest: {
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
  };
  avatar: {
    id: string;
    url: string;
  };
  rewardsRedeemed: [
    {
      boardRewards: {
        id: string;
        createdAt: string;
        updatedAt: string;
        value: number;
        description: string;
        title: string;
        image: {
          id: string;
          url: string;
        };
        subTitle: string;
      };
    },
  ];
  number: string;
  name: string;
  id: string;
  code: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  emailStatus: "VERIFIED" | "NOT_VERIFIED";
  platformRole: "USER" | "ROOT" | "ADMIN";
  visibility: "PUBLIC" | "PRIVATE";
  rankingName: string;
  street: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  document: string;
  documentType: "CPF" | "CNPJ";
  createdAt: string;
  updatedAt: string;
  gomarkeWorkspaceId: string;
  organization: string;
  marketingConfigured: boolean;
  salePlatformConfigured: boolean;
}
export namespace IGetUserByIdDTO {
  export type Args = {
    id: string;
  };
  export type Result = IUserById;
}
