import { api } from "@/libs/api";
import {
  ICreateLabsCategoryDTO,
  IGetLabsCategoryRankingDTO,
  ILabsCategory,
  ILabsCategoryDTO,
  IUpdateLabsCategoryDTO,
} from "@/types/labs/category/labs-category.type";
import { convertToFormData } from "@/utils/converteToFormData";
import { buildQueryString } from "@/utils/generateUrlWithParams";

const prefix = "/category";
export const categoryServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategory: builder.query<ILabsCategoryDTO.Result, ILabsCategoryDTO.Args>({
      query: (args) => ({
        url: buildQueryString({ args, endpoint: prefix }),
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              { type: "category" as const, id: "LIST" },
              ...result.data.map((category) => ({
                type: "category" as const,
                id: category.id,
              })),
            ]
          : [{ type: "category" as const, id: "LIST" }],
    }),
    createCategory: builder.mutation<ICreateLabsCategoryDTO.Result, ICreateLabsCategoryDTO.Args>({
      query: (args) => ({
        url: prefix,
        method: "POST",
        body: convertToFormData(args),
      }),
      invalidatesTags: [{ type: "category", id: "LIST" }],
    }),
    updateCategory: builder.mutation<IUpdateLabsCategoryDTO.Result, IUpdateLabsCategoryDTO.Args>({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "PUT",
        body: convertToFormData(args),
      }),
      invalidatesTags: [
        { type: "category", id: "LIST" },
        { type: "category", id: "RANKING" },
      ],
    }),
    deleteCategory: builder.mutation<{ codeIntern: string; message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "category", id: "LIST" },
        { type: "category", id: "RANKING" },
      ],
    }),
    getCategoryById: builder.query<ILabsCategory, { id: string }>({
      query: ({ id }) => ({
        url: `${prefix}/${id}`,
        method: "GET",
      }),
      providesTags: (result) => (result ? [{ type: "category", id: result.id }] : []),
    }),
    getCategoryRanking: builder.query<
      IGetLabsCategoryRankingDTO.Result,
      IGetLabsCategoryRankingDTO.Args
    >({
      query: (args) => ({
        url: `${prefix}/ranking`,
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "category" as const, id: "RANKING" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryRankingQuery,
  useGetCategoryByIdQuery,
} = categoryServices;
