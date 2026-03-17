import { api } from "@/libs/api";
import { ISpyCategoriesDTO } from "@/types/spy/spy-category.type";

export const spyCategoriesServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getSpyCategories: builder.query<ISpyCategoriesDTO.Result, ISpyCategoriesDTO.Args>({
      query: () => ({
        url: "spy/category",
        method: "GET",
      }),
      providesTags: [{ type: "spyCategories", id: "list" }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetSpyCategoriesQuery } = spyCategoriesServices;
