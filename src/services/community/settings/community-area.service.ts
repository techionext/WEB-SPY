import { api } from "@/libs/api";
import {
  ICreateCommunityAreaDTO,
  ICommunityAreaDTO,
  IUpdateCommunityAreaDTO,
} from "@/types/community/settings/community-area.type";
import { convertToFormData } from "@/utils/converteToFormData";
import { buildQueryString } from "@/utils/generateUrlWithParams";

const prefix = "community/video-group";
export const communityAreaServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getCommunityArea: builder.query<ICommunityAreaDTO.Result, ICommunityAreaDTO.Args>({
      query: (args) => ({
        url: buildQueryString({ args, endpoint: prefix }),
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              { type: "communityArea" as const, id: "LIST" },
              ...result.data.map((area) => ({
                type: "communityArea" as const,
                id: area.id,
              })),
            ]
          : [{ type: "communityArea" as const, id: "LIST" }],
    }),
    createCommunityArea: builder.mutation<
      ICreateCommunityAreaDTO.Result,
      ICreateCommunityAreaDTO.Args
    >({
      query: (args) => ({
        url: prefix,
        method: "POST",
        body: convertToFormData(args),
      }),
      invalidatesTags: [
        { type: "communityArea", id: "LIST" },
        { type: "community-video-group", id: "LIST" },
      ],
    }),
    updateCommunityArea: builder.mutation<
      IUpdateCommunityAreaDTO.Result,
      IUpdateCommunityAreaDTO.Args
    >({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "PUT",
        body: convertToFormData(args),
      }),
      invalidatesTags: [
        { type: "communityArea", id: "LIST" },
        { type: "community-video-group", id: "LIST" },
      ],
    }),
    deleteCommunityArea: builder.mutation<{ codeIntern: string; message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "communityArea", id: "LIST" },
        { type: "community-video-group", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCommunityAreaQuery,
  useCreateCommunityAreaMutation,
  useUpdateCommunityAreaMutation,
  useDeleteCommunityAreaMutation,
} = communityAreaServices;
