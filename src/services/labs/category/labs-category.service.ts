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

const prefix = "labs/category";
export const labsCategoryServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getLabsCategory: builder.query<ILabsCategoryDTO.Result, ILabsCategoryDTO.Args>({
      query: (args) => ({
        url: buildQueryString({ args, endpoint: prefix }),
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              { type: "labsCategory" as const, id: "LIST" },
              ...result.data.map((category) => ({
                type: "labsCategory" as const,
                id: category.id,
              })),
            ]
          : [{ type: "labsCategory" as const, id: "LIST" }],
    }),
    createLabsCategory: builder.mutation<
      ICreateLabsCategoryDTO.Result,
      ICreateLabsCategoryDTO.Args
    >({
      query: (args) => ({
        url: prefix,
        method: "POST",
        body: convertToFormData(args),
      }),
      invalidatesTags: [{ type: "labsCategory", id: "LIST" }],
    }),
    updateLabsCategory: builder.mutation<
      IUpdateLabsCategoryDTO.Result,
      IUpdateLabsCategoryDTO.Args
    >({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "PUT",
        body: convertToFormData(args),
      }),
      invalidatesTags: [
        { type: "labsCategory", id: "LIST" },
        { type: "labsCategory", id: "RANKING" },
      ],
    }),
    deleteLabsCategory: builder.mutation<{ codeIntern: string; message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "labsCategory", id: "LIST" },
        { type: "labsCategory", id: "RANKING" },
      ],
    }),
    getLabsCategoryById: builder.query<ILabsCategory, { id: string }>({
      query: ({ id }) => ({
        url: `${prefix}/${id}`,
        method: "GET",
      }),
      providesTags: (result) => (result ? [{ type: "labsCategory", id: result.id }] : []),
    }),
    getLabsCategoryRanking: builder.query<
      IGetLabsCategoryRankingDTO.Result,
      IGetLabsCategoryRankingDTO.Args
    >({
      query: (args) => ({
        url: `${prefix}/ranking`,
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "labsCategory" as const, id: "RANKING" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetLabsCategoryQuery,
  useCreateLabsCategoryMutation,
  useUpdateLabsCategoryMutation,
  useDeleteLabsCategoryMutation,
  useGetLabsCategoryRankingQuery,
  useGetLabsCategoryByIdQuery,
} = labsCategoryServices;
