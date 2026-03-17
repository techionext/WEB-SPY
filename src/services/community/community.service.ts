import { api } from "@/libs/api";
import {
  ICommunityCategoryDTO,
  ICommunityCreatorsDTO,
  ICommunityVideoDTO,
  ICommunityVideoGroupDTO,
  IFavoriteVideoDTO,
} from "@/types/community/community.type";

export const communityServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getCommunityVideoGroup: builder.query<
      ICommunityVideoGroupDTO.Result,
      ICommunityVideoGroupDTO.Args
    >({
      query: (args) => ({
        url: "community/video-group",
        method: "GET",
        params: args,
      }),
      providesTags: (result) => [
        { type: "community-video-group", id: "LIST" },
        ...(result?.data?.map((item) => ({
          type: "community-video-group" as const,
          id: item.id,
        })) || []),
      ],
    }),
    getCommunityVideos: builder.query<ICommunityVideoDTO.Result, ICommunityVideoDTO.Args>({
      query: (args) => ({
        url: "community/video",
        method: "GET",
        params: args,
      }),
      providesTags: (result, error, args) => [
        { type: "community-video-group", id: args.videoGroup[0] },
        ...(result?.data?.map((item) => ({
          type: "community-video" as const,
          id: item.id,
        })) || []),
      ],
    }),
    postFavoriteVideo: builder.mutation<IFavoriteVideoDTO.Result, IFavoriteVideoDTO.Args>({
      query: (args) => ({
        url: `community/video/${args.id}/favorite`,
        method: "POST",
      }),
      invalidatesTags: (result, error, args) => [{ type: "community-video" as const, id: args.id }],
    }),
    getCommunityCategory: builder.query<ICommunityCategoryDTO.Result, ICommunityCategoryDTO.Args>({
      query: (args) => ({
        url: `community/video-group/${args.id}/category`,
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "community", id: "LIST" }],
    }),
    getCommunityCreators: builder.query<ICommunityCreatorsDTO.Result, ICommunityCreatorsDTO.Args>({
      query: (args) => ({
        url: `community/video-group/${args.id}/content-creator`,
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "community", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCommunityVideoGroupQuery,
  useGetCommunityVideosQuery,
  useGetCommunityCategoryQuery,
  useGetCommunityCreatorsQuery,
  usePostFavoriteVideoMutation,
} = communityServices;
