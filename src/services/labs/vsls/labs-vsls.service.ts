import { api } from "@/libs/api";
import {
  ICreateLabsVSLDTO,
  ILabsVslById,
  ILabsVSLSDTO,
  ILabsVslUploadingDTO,
  IUpdateLabsVSLDTO,
} from "@/types/labs/vsls/labs-vsls.type";
import { convertToFormData } from "@/utils/converteToFormData";
import { buildQueryString } from "@/utils/generateUrlWithParams";

const prefix = "labs/vsl";

export const labsVSLSservices = api.injectEndpoints({
  endpoints: (builder) => ({
    createLabsVSL: builder.mutation<ICreateLabsVSLDTO.Result, ICreateLabsVSLDTO.Args>({
      query: (args) => ({
        url: prefix,
        method: "POST",
        body: convertToFormData({ ...args, video: undefined }),
      }),
      invalidatesTags: [{ type: "vsls", id: "LIST" }],
    }),
    getLabsVSLS: builder.query<ILabsVSLSDTO.Result, ILabsVSLSDTO.Args>({
      query: (args) => ({
        url: buildQueryString({ args, endpoint: prefix }),
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              { type: "vsls", id: "LIST" },
              ...result.data.map((vsl) => ({
                type: "vsls" as const,
                id: vsl.id,
              })),
            ]
          : [{ type: "vsls", id: "LIST" }],
    }),
    getLabsVSLById: builder.query<ILabsVslById, { id: string }>({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "GET",
      }),
      providesTags: (result, error, args) => [{ type: "vsls", id: args.id }],
    }),
    deleteLabsVSL: builder.mutation<{ codeIntern: string; message: string }, { id: string }>({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, args) => [{ type: "vsls", id: args.id }],
    }),
    updateLabsVSL: builder.mutation<IUpdateLabsVSLDTO.Result, IUpdateLabsVSLDTO.Args>({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "PUT",
        body: convertToFormData({ ...args, video: undefined }),
      }),
      invalidatesTags: [{ type: "vsls", id: "LIST" }],
    }),
    getLabsVSLUploading: builder.query<ILabsVslUploadingDTO.Result, ILabsVslUploadingDTO.Args>({
      query: (args) => ({
        url: `${prefix}/uploading`,
        method: "GET",
        params: args,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateLabsVSLMutation,
  useGetLabsVSLSQuery,
  useGetLabsVSLByIdQuery,
  useDeleteLabsVSLMutation,
  useUpdateLabsVSLMutation,
  useGetLabsVSLUploadingQuery,
} = labsVSLSservices;
