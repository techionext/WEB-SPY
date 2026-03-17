import { api } from "@/libs/api";
import {
  IBoardRankingDeleteDTO,
  IBoardRankingDTO,
  IBoardRankingPostDTO,
  IBoardRankingPutDTO,
  IBoardRankingSummaryDTO,
} from "@/types/root/board-ranking/board-ranking.type";
import { convertToFormData } from "@/utils/converteToFormData";

export const boardRankingService = api.injectEndpoints({
  endpoints: (builder) => ({
    getBoardRanking: builder.query<IBoardRankingDTO.Result, IBoardRankingDTO.Args>({
      query: (args) => ({
        url: "/board-ranking",
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "boardRanking", id: "list" }],
    }),
    postBoardRanking: builder.mutation<IBoardRankingPostDTO.Result, IBoardRankingPostDTO.Args>({
      query: (args) => ({
        url: "/board-ranking",
        method: "POST",
        body: convertToFormData(args),
      }),
      invalidatesTags: [{ type: "boardRanking", id: "list" }],
    }),
    putBoardRanking: builder.mutation<IBoardRankingPutDTO.Result, IBoardRankingPutDTO.Args>({
      query: (args) => ({
        url: `/board-ranking/${args.id}`,
        method: "PUT",
        body: convertToFormData(args),
      }),
      invalidatesTags: [{ type: "boardRanking", id: "list" }],
    }),
    deleteBoardRanking: builder.mutation<
      IBoardRankingDeleteDTO.Result,
      IBoardRankingDeleteDTO.Args
    >({
      query: (args) => ({
        url: `/board-ranking/${args.id}`,
        method: "DELETE",
        body: args,
      }),
      invalidatesTags: [{ type: "boardRanking", id: "list" }],
    }),
    getBoardRankingSummary: builder.query<
      IBoardRankingSummaryDTO.Result,
      IBoardRankingSummaryDTO.Args
    >({
      query: () => ({
        url: "/board-ranking/summary",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetBoardRankingQuery,
  usePostBoardRankingMutation,
  usePutBoardRankingMutation,
  useDeleteBoardRankingMutation,
  useGetBoardRankingSummaryQuery,
} = boardRankingService;
