import { api } from "@/libs/api";
import { ISubscriptionGetDTO } from "@/types/subscriptions/sybscription.type";
import { buildQueryString } from "@/utils/generateUrlWithParams";

const prefix = "subscription/payments";

export const subscriptionServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptions: builder.query<ISubscriptionGetDTO.Result, ISubscriptionGetDTO.Args>({
      query: (args) => ({
        url: buildQueryString({ args, endpoint: prefix }),
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "subscriptions" as const, id })),
              { type: "subscriptions", id: "LIST" },
            ]
          : [{ type: "subscriptions", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetSubscriptionsQuery } = subscriptionServices;
