import { api } from "@/libs/api";

export namespace IMetrics {
  export type Args = {
    startDate: string;
    endDate: string;
  };
  export type Result = {
    data: [
      {
        revenue: number;
        date: string;
      },
    ];
  };
}
export const metricsServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getMetrics: builder.query<IMetrics.Result, IMetrics.Args>({
      query: (args) => ({
        url: "/metrics/user/revenue",
        method: "GET",
        params: args,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetMetricsQuery } = metricsServices;
