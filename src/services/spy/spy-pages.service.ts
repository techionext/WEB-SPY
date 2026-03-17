import { api } from "@/libs/api";
import { ISpyPagesDTO } from "@/types/spy/spy-pages.type";

export const spyPagesServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getSpyPages: builder.query<ISpyPagesDTO.Result, ISpyPagesDTO.Args>({
      query: (args) => ({
        url: "spy/page",
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "spyPages", id: "list" }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetSpyPagesQuery } = spyPagesServices;
