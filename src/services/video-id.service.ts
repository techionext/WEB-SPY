import { api } from "@/libs/api";

import {
  ICategoriesVideoDTO,
  ICommentVideoByIdDTO,
  ICommentVideoDTO,
  IGetVideoUploadingDTO,
  IPostCommentVideoDTO,
  IPostCommentVideoReplyDTO,
  IPostVideoCommunityDTO,
  IPutVideoCommunityDTO,
  IReactionCommentVideoDTO,
  IReactionVideoDTO,
  IVideoGetDTO,
} from "@/types/video.type";
import { convertToFormData } from "@/utils/converteToFormData";

export const videoIdServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getVideoId: builder.query<IVideoGetDTO.Result, IVideoGetDTO.Args>({
      query: (args) => ({
        url: `community/video/${args.id}`,
        method: "GET",
        params: args,
      }),
      providesTags: (result, error, args) => [{ type: "community-video", id: args.id }],
    }),
    postReactionVideo: builder.mutation<IReactionVideoDTO.Result, IReactionVideoDTO.Args>({
      query: (args) => ({
        url: `community/video/${args.id}/reaction`,
        method: "POST",
        body: args,
      }),
      invalidatesTags: (result, error, args) => [{ type: "community-video", id: args.id }],
    }),
    getCommentsVideo: builder.query<ICommentVideoDTO.Result, ICommentVideoDTO.Args>({
      query: (args) => ({
        url: `community/video-comment`,
        method: "GET",
        params: args,
      }),
      providesTags: (result, error, args) => [
        { type: "community-video-comment", id: args.videoId },
        { type: "community-video-comment", id: "LIST" },
        ...(result?.data?.map((item) => ({
          type: "community-video-comment" as const,
          id: item.id,
        })) || []),
      ],
    }),
    postCommentVideo: builder.mutation<IPostCommentVideoDTO.Result, IPostCommentVideoDTO.Args>({
      query: (args) => ({
        url: `community/video-comment`,
        method: "POST",
        body: args,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "community-video-comment", id: args.videoId },
      ],
    }),
    getRepliesCommentsVideoById: builder.query<
      ICommentVideoByIdDTO.Result,
      ICommentVideoByIdDTO.Args
    >({
      query: (args) => ({
        url: `community/video-comment/${args.id}`,
        method: "GET",
        params: args,
      }),
      providesTags: (result, error, args) => [
        { type: "community-video-comment", id: args.id },
        { type: "community-video-comment", id: "LIST" },
      ],
    }),
    postCommentVideoReply: builder.mutation<
      IPostCommentVideoReplyDTO.Result,
      IPostCommentVideoReplyDTO.Args
    >({
      query: (args) => ({
        url: `community/video-comment/${args.id}/replies`,
        method: "POST",
        body: args,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "community-video-comment", id: args.id },
        { type: "community-video-comment", id: "LIST" },
      ],
    }),
    postReactionCommentVideo: builder.mutation<
      IReactionCommentVideoDTO.Result,
      IReactionCommentVideoDTO.Args
    >({
      query: (args) => ({
        url: `community/video-comment/${args.id}/react`,
        method: "POST",
        body: args,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "community-video-comment", id: args.id },
        { type: "community-video-comment", id: "LIST" },
      ],
    }),
    postVideoCommunity: builder.mutation<
      IPostVideoCommunityDTO.Result,
      IPostVideoCommunityDTO.Args
    >({
      query: (args) => ({
        url: `community/video`,
        method: "POST",
        body: convertToFormData({ ...args, video: undefined }),
      }),
      invalidatesTags: (result, error, args) => [
        { type: "community-video-group", id: args.videoGroupId },
        { type: "community-video-group", id: "LIST" },
        { type: "community", id: "LIST" },
      ],
    }),
    putVideoCommunity: builder.mutation<IPutVideoCommunityDTO.Result, IPutVideoCommunityDTO.Args>({
      query: (args) => ({
        url: `community/video/${args.id}`,
        method: "PUT",
        body: convertToFormData(args),
      }),
      invalidatesTags: (result, error, args) => [{ type: "community-video", id: args.id }],
    }),
    getVideoUploading: builder.query<IGetVideoUploadingDTO.Result, IGetVideoUploadingDTO.Args>({
      query: (args) => ({
        url: `community/video/uploading`,
        method: "GET",
        params: args,
      }),
    }),
    deleteVideoCommunity: builder.mutation<{ codeIntern: string; message: string }, { id: string }>(
      {
        query: (args) => ({
          url: `community/video/${args.id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, args) => [{ type: "community-video", id: args.id }],
      },
    ),
    getCategoriesVideo: builder.query<ICategoriesVideoDTO.Result, ICategoriesVideoDTO.Args>({
      query: (args) => ({
        url: `community/video-group/${args.id}/category`,
        method: "GET",
        params: args,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetVideoIdQuery,
  usePostReactionVideoMutation,
  useGetCommentsVideoQuery,
  usePostCommentVideoMutation,
  useGetRepliesCommentsVideoByIdQuery,
  usePostCommentVideoReplyMutation,
  usePostReactionCommentVideoMutation,

  usePostVideoCommunityMutation,
  usePutVideoCommunityMutation,
  useDeleteVideoCommunityMutation,
  useGetCategoriesVideoQuery,
  useGetVideoUploadingQuery,
} = videoIdServices;
