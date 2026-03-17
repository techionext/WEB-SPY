import { api } from "@/libs/api";
import {
  IPlataformSettingsDTO,
  IUpdatePlataformSettingsDTO,
} from "@/types/settings/platform-settings.type";
import { buildQueryString } from "@/utils/generateUrlWithParams";

const prefix = "platform-settings";
export const plataformSettingsServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlataformSettings: builder.query<IPlataformSettingsDTO.Result, IPlataformSettingsDTO.Args>({
      query: (args) => ({
        url: buildQueryString({ args, endpoint: prefix }),
        method: "GET",
      }),
      providesTags: [{ type: "settings", id: "list" }],
    }),
    updatePlataformSettings: builder.mutation<
      IUpdatePlataformSettingsDTO.Result,
      IUpdatePlataformSettingsDTO.Args
    >({
      query: (args) => ({
        url: prefix,
        method: "PUT",
        body: args,
      }),
      invalidatesTags: [{ type: "settings", id: "list" }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetPlataformSettingsQuery, useUpdatePlataformSettingsMutation } =
  plataformSettingsServices;
