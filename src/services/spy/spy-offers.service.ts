import { api } from "@/libs/api";
import {
  ISpyOfferByIdHistoryDTO,
  ISpyOfferDTOById,
  ISpyOfferFavoriteDTO,
  ISpyOfferGroupedDTO,
  ISpyOffersDTO,
  ISpyQuizDTO,
  ISpyVSLDownloadDTO,
  ISpyVSLSDTO,
} from "@/types/spy/spy-offers.type";

export const spyOffersServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getSpyOffers: builder.query<ISpyOffersDTO.Result, ISpyOffersDTO.Args>({
      query: (args) => ({
        url: "spy/offer",
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "spyOffers", id: "list" }],
    }),
    getSpyOfferGrouped: builder.query<ISpyOfferGroupedDTO.Result, ISpyOfferGroupedDTO.Args>({
      query: (args) => ({
        url: "spy/offer/grouped",
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "spyOffers", id: "list" }],
    }),
    postSpyOfferFavorite: builder.mutation<ISpyOfferFavoriteDTO.Result, ISpyOfferFavoriteDTO.Args>({
      query: (args) => ({
        url: `spy/offer/${args.id}/favorite`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "spyOffers", id: "list" }],
    }),
    getSpyOfferById: builder.query<ISpyOfferDTOById.Result, ISpyOfferDTOById.Args>({
      query: (args) => ({
        url: `spy/offer/${args.id}`,
        method: "GET",
      }),
      providesTags: [{ type: "spyOffers", id: "list" }],
    }),
    getSpyOfferByIdHistory: builder.query<
      ISpyOfferByIdHistoryDTO.Result,
      ISpyOfferByIdHistoryDTO.Args
    >({
      query: (args) => ({
        url: `spy/offer/${args.id}/history`,
        method: "GET",
        params: {
          ...(args.startDate && { startDate: args.startDate }),
          ...(args.endDate && { endDate: args.endDate }),
        },
      }),
      providesTags: [{ type: "spyOffers", id: "list" }],
    }),
    getSpyVSLS: builder.query<ISpyVSLSDTO.Result, ISpyVSLSDTO.Args>({
      query: (args) => ({
        url: `spy/vsl`,
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "spyOffers", id: "list" }],
    }),
    getSpyVslDownload: builder.query<ISpyVSLDownloadDTO.Result, ISpyVSLDownloadDTO.Args>({
      query: (args) => ({
        url: `spy/vsl/${args.id}/download`,
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "spyOffers", id: "list" }],
    }),
    getSpyQuiz: builder.query<ISpyQuizDTO.Result, ISpyQuizDTO.Args>({
      query: (args) => ({
        url: `spy/offer/${args.id}/quiz`,
        method: "GET",
      }),
      providesTags: [{ type: "spyOffers", id: "list" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSpyOffersQuery,
  useGetSpyOfferGroupedQuery,
  usePostSpyOfferFavoriteMutation,
  useGetSpyOfferByIdQuery,
  useGetSpyOfferByIdHistoryQuery,
  useGetSpyVSLSQuery,
  useGetSpyVslDownloadQuery,
  useLazyGetSpyVslDownloadQuery,
  useGetSpyQuizQuery,
} = spyOffersServices;
