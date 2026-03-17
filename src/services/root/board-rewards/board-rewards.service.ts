import { api } from "@/libs/api";
import {
  IBoardRewardsDeleteDTO,
  IBoardRewardsDTO,
  IBoardRewardsPostDTO,
  IBoardRewardsPutDTO,
  IBoardRewardsSummaryDTO,
} from "@/types/root/board-rewards/board-rewards.type";

import { convertToFormData } from "@/utils/converteToFormData";

export const boardRewardsService = api.injectEndpoints({
  endpoints: (builder) => ({
    getBoardRewards: builder.query<IBoardRewardsDTO.Result, IBoardRewardsDTO.Args>({
      query: (args) => ({
        url: "/board-reward",
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "boardRewards", id: "list" }],
    }),
    postBoardRewards: builder.mutation<IBoardRewardsPostDTO.Result, IBoardRewardsPostDTO.Args>({
      query: (args) => ({
        url: "/board-reward",
        method: "POST",
        body: convertToFormData(args),
      }),
      invalidatesTags: [{ type: "boardRewards", id: "list" }],
    }),
    putBoardRewards: builder.mutation<IBoardRewardsPutDTO.Result, IBoardRewardsPutDTO.Args>({
      query: (args) => ({
        url: `/board-reward/${args.id}`,
        method: "PUT",
        body: convertToFormData(args),
      }),
      invalidatesTags: [{ type: "boardRewards", id: "list" }],
    }),
    deleteBoardRewards: builder.mutation<
      IBoardRewardsDeleteDTO.Result,
      IBoardRewardsDeleteDTO.Args
    >({
      query: (args) => ({
        url: `/board-reward/${args.id}`,
        method: "DELETE",
        body: args,
      }),
      invalidatesTags: [{ type: "boardRewards", id: "list" }],
    }),
    getBoardRewardsSummary: builder.query<
      IBoardRewardsSummaryDTO.Result,
      IBoardRewardsSummaryDTO.Args
    >({
      query: () => ({
        url: "/board-reward/summary",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetBoardRewardsQuery,
  usePostBoardRewardsMutation,
  usePutBoardRewardsMutation,
  useDeleteBoardRewardsMutation,
  useGetBoardRewardsSummaryQuery,
} = boardRewardsService;
