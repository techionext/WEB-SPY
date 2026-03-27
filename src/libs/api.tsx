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
    "category",
    "vsls",
    "creatives",
    "offers",
    "pages",
    "settings",
    "spyCreatives",
    "spyOffers",
    "session",
    "users",
    "community",
    "community-video",
    "community-video-comment",
    "community-video-group",
    "creatives-history",
    "analysis-requests",
    "analysis-requests-files",
  ],
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {} = api;
