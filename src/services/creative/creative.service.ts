import { api } from "@/libs/api";
import {
  ICreateLabsCreativeDTO,
  ILabsCreative,
  ILabsCreativesDTO,
  IUpdateLabsCreativeDTO,
} from "@/types/labs/creative/labs-creative.type";
import { convertToFormData } from "@/utils/converteToFormData";
import { buildQueryString } from "@/utils/generateUrlWithParams";

const prefix = "creative";

export const labsCreativeServices = api.injectEndpoints({
  endpoints: (builder) => ({
    createLabsCreative: builder.mutation<
      ICreateLabsCreativeDTO.Result,
      ICreateLabsCreativeDTO.Args
    >({
      query: (args) => ({
        url: prefix,
        method: "POST",
        body: convertToFormData({ ...args, video: undefined }),
      }),
      invalidatesTags: [{ type: "creatives", id: "LIST" }],
    }),
    getLabsCreative: builder.query<ILabsCreativesDTO.Result, ILabsCreativesDTO.Args>({
      query: (args) => ({
        url: buildQueryString({ args, endpoint: prefix }),
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "creatives", id: "LIST" },
              ...result.data.map(({ id }) => ({ type: "creatives" as const, id })),
            ]
          : [{ type: "creatives", id: "LIST" }],
    }),
    getLabsCreativeById: builder.query<ILabsCreative, { id: string }>({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [{ type: "creatives", id: id }],
    }),
    deleteLabsCreative: builder.mutation<{ codeIntern: string; message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "creatives", id: id }],
    }),
    updateLabsCreative: builder.mutation<
      IUpdateLabsCreativeDTO.Result,
      IUpdateLabsCreativeDTO.Args
    >({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "PUT",
        body: convertToFormData(args),
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "creatives", id: id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateLabsCreativeMutation,
  useGetLabsCreativeByIdQuery,
  useGetLabsCreativeQuery,
  useUpdateLabsCreativeMutation,
  useDeleteLabsCreativeMutation,
} = labsCreativeServices;
