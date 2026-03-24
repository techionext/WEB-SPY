import { api } from "@/libs/api";
import { ICreateLabsPageDTO, ILabsPage } from "@/types/labs/page/labs-page.type";
import { ILabsPagesDTO, IUpdateLabsPageDTO } from "@/types/offer/offer.type";
import { convertToFormData } from "@/utils/converteToFormData";
import { buildQueryString } from "@/utils/generateUrlWithParams";

const prefix = "page";

export const labsPageServices = api.injectEndpoints({
  endpoints: (builder) => ({
    createLabsPage: builder.mutation<ICreateLabsPageDTO.Result, ICreateLabsPageDTO.Args>({
      query: (args) => ({
        url: prefix,
        method: "POST",
        body: convertToFormData(args),
      }),
      invalidatesTags: [{ type: "pages", id: "LIST" }],
    }),
    getLabsPages: builder.query<ILabsPagesDTO.Result, ILabsPagesDTO.Args>({
      query: (args) => ({
        url: buildQueryString({ args, endpoint: prefix }),
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              { type: "pages", id: "LIST" },
              ...result.data.map((page) => ({
                type: "pages" as const,
                id: page.id,
              })),
            ]
          : [{ type: "pages", id: "LIST" }],
    }),
    getLabsPageById: builder.query<ILabsPage, { id: string }>({
      query: ({ id }) => ({
        url: `${prefix}/${id}`,
        method: "GET",
      }),
      providesTags: (result) => (result ? [{ type: "pages", id: result.id }] : []),
    }),
    deleteLabsPage: builder.mutation<{ codeIntern: string; message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "pages", id: "LIST" }],
    }),
    updateLabsPage: builder.mutation<IUpdateLabsPageDTO.Result, IUpdateLabsPageDTO.Args>({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "PUT",
        body: convertToFormData(args),
      }),
      invalidatesTags: (result, error, args) => [{ type: "pages", id: args.id }],
    }),
    archivePage: builder.mutation<
      { codeIntern: string; message: string },
      { id: string; archiveReason?: string }
    >({
      query: ({ id, archiveReason }) => ({
        url: `${prefix}/${id}/archive`,
        method: "PATCH",
        body: { archiveReason },
      }),
      invalidatesTags: (result, error, args) => [{ type: "pages", id: args.id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateLabsPageMutation,
  useGetLabsPagesQuery,
  useGetLabsPageByIdQuery,
  useDeleteLabsPageMutation,
  useUpdateLabsPageMutation,
  useArchivePageMutation,
} = labsPageServices;
