import { api } from "@/libs/api";
import {
  ISpyOfferByIdHistoryDTO,
  ISpyOfferDTOById,
  ISpyOfferFavoriteDTO,
  ISpyOffersDTO,
  ISpyOfferUpdateDTO,
} from "@/types/spy/spy-offers.type";

const prefix = "offer";

export const spyOffersServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getSpyOffers: builder.query<ISpyOffersDTO.Result, ISpyOffersDTO.Args>({
      query: (args) => ({
        url: `${prefix}`,
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "spyOffers", id: "list" }],
    }),
    getSpyOfferById: builder.query<ISpyOfferDTOById.Result, ISpyOfferDTOById.Args>({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "GET",
      }),
      providesTags: [{ type: "spyOffers", id: "list" }],
    }),
    updateSpyOffer: builder.mutation<ISpyOfferUpdateDTO.Result, ISpyOfferUpdateDTO.Args>({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "PUT",
        body: args,
      }),
      invalidatesTags: [{ type: "spyOffers", id: "list" }],
    }),
    postSpyOfferFavorite: builder.mutation<ISpyOfferFavoriteDTO.Result, ISpyOfferFavoriteDTO.Args>({
      query: (args) => ({
        url: `${prefix}/${args.id}/favorite`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "spyOffers", id: "list" }],
    }),
    getSpyOfferByIdHistory: builder.query<
      ISpyOfferByIdHistoryDTO.Result,
      ISpyOfferByIdHistoryDTO.Args
    >({
      query: (args) => ({
        url: `${prefix}/${args.id}/history`,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSpyOffersQuery,
  usePostSpyOfferFavoriteMutation,
  useGetSpyOfferByIdQuery,
  useGetSpyOfferByIdHistoryQuery,
} = spyOffersServices;
