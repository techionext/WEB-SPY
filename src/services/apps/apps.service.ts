import { api } from "@/libs/api";

export interface IApp {
  isAppMain: boolean;
  id: string;
  title: string;
  description: string;
  category: string[];
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
  organization: {
    isAppUse: boolean;
  };
}

namespace IAppDTO {
  export interface Result {
    data: IApp[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  }
  export interface Args {
    page?: number;
    pageSize?: number;
    filter?: string;
  }
}

namespace IAppLoginDTO {
  export interface Result {
    redirectUrl: string;
  }
  export interface Args {
    id: string;
  }
}
const prefix = "/apps";
export const appsServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getApps: builder.query<IAppDTO.Result, IAppDTO.Args>({
      query: (args) => ({
        url: prefix,
        method: "GET",
        params: args,
      }),
    }),
    appsLogin: builder.mutation<IAppLoginDTO.Result, IAppLoginDTO.Args>({
      query: (args) => ({
        url: `${prefix}/login/${args.id}`,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: true,
});
export const { useGetAppsQuery, useAppsLoginMutation } = appsServices;
