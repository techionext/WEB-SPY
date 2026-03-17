import { api } from "@/libs/api";
import { IPlanGetDTO } from "@/types/plan/plan.type";
import { buildQueryString } from "@/utils/generateUrlWithParams";

const prefix = "plan";

export const planServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<IPlanGetDTO.Result, IPlanGetDTO.Args>({
      query: (args) => ({
        url: buildQueryString({ args, endpoint: prefix }),
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "plans" as const, id })),
              { type: "plans", id: "LIST" },
            ]
          : [{ type: "plans", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetPlansQuery } = planServices;
