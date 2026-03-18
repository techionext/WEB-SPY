// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { appConfig } from "@/config/app-config";
import { RootState } from "./store";

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.session.token || Cookies.get(appConfig.token);

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "session",
    "category",
    "spyOffers",
    "spyCategories",
    "spyCreatives",
    "spyPages",
    "offers",
    "community",
    "leaderboard",
    "community-video-group",
    "community-video",
    "community-video-comment",
    "settings",
    "plans",
    "creatives",
    "pages",
    "vsls",
    "boardRanking",
    "boardRewards",
    "communityArea",
    "producer",
    "subscriptions",
    "season",
    "ranking",
    "affiliationRequests",
    "platforms",
    "finances",
    "sales",
    "marketing",
    "funnel",
    "accounts",
    "users",
  ],
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {} = api;
