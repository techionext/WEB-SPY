import { api } from "@/libs/api";
import {
  ISpyOfferByIdHistoryDTO,
  ISpyOfferCreateDTO,
  ISpyOfferDTOById,
  ISpyOfferFavoriteDTO,
  ISpyOffersDTO,
  ISpyOfferUpdateDTO,
  ISpyOfferGroupedDTO,
} from "@/types/spy/spy-offers.type";
import { convertToFormData } from "@/utils/converteToFormData";

const prefix = "offer";

export const spyOffersServices = api.injectEndpoints({
  endpoints: (builder) => ({
    createSpyOffer: builder.mutation<ISpyOfferCreateDTO.Result, ISpyOfferCreateDTO.Args>({
      query: (args) => ({
        url: `${prefix}`,
        method: "POST",
        body: convertToFormData(args),
      }),
      invalidatesTags: [{ type: "spyOffers", id: "list" }],
    }),
    getSpyOffers: builder.query<ISpyOffersDTO.Result, ISpyOffersDTO.Args>({
      query: (args) => ({
        url: `${prefix}`,
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "spyOffers", id: "list" }],
    }),
    getSpyOfferGrouped: builder.query<ISpyOfferGroupedDTO.Result, ISpyOfferGroupedDTO.Args>({
      query: (args) => ({
        url: `${prefix}/grouped`,
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "spyOffers", id: "grouped" }],
    }),
    removeSpyOffer: builder.mutation<{ codeIntern: string; message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "spyOffers", id: "list" }],
    }),
    getSpyOfferById: builder.query<ISpyOfferDTOById.Result, ISpyOfferDTOById.Args>({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "GET",
      }),
      providesTags: [{ type: "spyOffers", id: "list" }],
    }),
    updateSpyOffer: builder.mutation<ISpyOfferUpdateDTO.Result, ISpyOfferUpdateDTO.Args>({
      query: ({ id, ...args }) => ({
        url: `${prefix}/${id}`,
        method: "PUT",
        body: convertToFormData(args),
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
  useCreateSpyOfferMutation,
  useGetSpyOffersQuery,
  usePostSpyOfferFavoriteMutation,
  useGetSpyOfferByIdQuery,
  useGetSpyOfferByIdHistoryQuery,
  useRemoveSpyOfferMutation,
  useUpdateSpyOfferMutation,
  useGetSpyOfferGroupedQuery,
} = spyOffersServices;
