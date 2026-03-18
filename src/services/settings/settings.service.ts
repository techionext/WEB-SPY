import { api } from "@/libs/api";
import { ISettingsDTO, IUpdateSettingsDTO } from "@/types/settings/settings.type";
import { buildQueryString } from "@/utils/generateUrlWithParams";

const prefix = "setting";
export const settingsServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<ISettingsDTO.Result, ISettingsDTO.Args>({
      query: (args) => ({
        url: buildQueryString({ args, endpoint: prefix }),
        method: "GET",
      }),
      providesTags: [{ type: "settings", id: "list" }],
    }),
    updateSettings: builder.mutation<IUpdateSettingsDTO.Result, IUpdateSettingsDTO.Args>({
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

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsServices;
