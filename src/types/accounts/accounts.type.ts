export type IAccount = {
  totalAdAccounts: number;
  image: {
    id: string;
    url: string;
    mimeType: string;
  };
  id: string;
  externalId: string;
  type: "GOOGLE" | "FACEBOOK";
  profileName: string;
  expiresAt: string;
  googleHasAccounts: boolean;
  isDeleted: boolean;
  isValid: boolean;
  workSpaceId: string;
  createdAt: string;
};

export namespace IAccountsGetDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
    type?: "GOOGLE" | "FACEBOOK";
  };
  export type Result = {
    data: IAccount[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export namespace IAccountCreateGoogleDTO {
  export type Args = {
    code: string;
    redirectUrl: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IAccountCreateMetaDTO {
  export type Args = {
    metaToken: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IDeleteAccountDTO {
  export type Args = {
    id: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export type IAdsAccount = {
  id: string;
  title: string;
  valueGross: number;
  valueNet: number;
  profit: number;
  totalInvestedMarketing: number;
  externalStatus: string;
  isActive: boolean;
  tag: string;
  status: boolean;
  type: "GOOGLE" | "FACEBOOK";
  business: {
    id: string;
    title: string;
  };
};

export namespace IAdsAccountsGetDTO {
  export type Args = {
    accountId?: string;
    page?: number;
    pageSize?: number;
    filter?: string;
    type?: "GOOGLE" | "FACEBOOK";
  };
  export type Result = {
    data: IAdsAccount[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}
