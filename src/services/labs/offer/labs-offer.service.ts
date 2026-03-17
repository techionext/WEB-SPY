import { api } from "@/libs/api";
import {
  ICreateLabsOfferDTO,
  ILabsOfferDTO,
  IPostLabsOfferGroupedDTO,
  IUpdateLabsOfferDTO,
} from "@/types/labs/offer/labs-offer.type";
import {
  IAffiliateLabsOfferDTO,
  IFavoriteLabsOfferDTO,
  IGetLabsOfferSimpleDTO,
  IOfferDTOById,
} from "@/types/offer/offer.type";
import { convertToFormData } from "@/utils/converteToFormData";
import { buildQueryString } from "@/utils/generateUrlWithParams";

const prefix = "labs/offer";

export const labsOfferServices = api.injectEndpoints({
  endpoints: (builder) => ({
    createLabsOffer: builder.mutation<ICreateLabsOfferDTO.Result, ICreateLabsOfferDTO.Args>({
      query: (args) => ({
        url: prefix,
        method: "POST",
        body: convertToFormData(args),
      }),
      invalidatesTags: [{ type: "offers", id: "LIST" }],
    }),
    getLabsOffer: builder.query<ILabsOfferDTO.Result, ILabsOfferDTO.Args>({
      query: (args) => ({
        url: buildQueryString({ args, endpoint: prefix }),
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "offers" as const, id })),
              { type: "offers", id: "LIST" },
            ]
          : [{ type: "offers", id: "LIST" }],
    }),
    getLabsOfferById: builder.query<IOfferDTOById.Result, IOfferDTOById.Args>({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "GET",
        params: args,
      }),
      providesTags: (result) => [{ type: "offers", id: result?.id }],
    }),
    deleteLabsOffer: builder.mutation<{ codeIntern: string; message: string }, { id: string }>({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, args) => [{ type: "offers", id: args.id }],
    }),
    updateLabsOffer: builder.mutation<IUpdateLabsOfferDTO.Result, IUpdateLabsOfferDTO.Args>({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "PUT",
        body: convertToFormData(args),
      }),
      invalidatesTags: (result, error, args) => [{ type: "offers", id: args.id }],
    }),
    favoriteLabsOffer: builder.mutation<IFavoriteLabsOfferDTO.Result, IFavoriteLabsOfferDTO.Args>({
      query: (args) => ({
        url: `${prefix}/${args.id}/favorite`,
        method: "POST",
      }),
      invalidatesTags: (result, error, args) => [
        { type: "offers", id: args.id },
        { type: "offers", id: "LIST" },
      ],
    }),
    getLabsOfferSimple: builder.query<IGetLabsOfferSimpleDTO.Result, IGetLabsOfferSimpleDTO.Args>({
      query: (args) => ({
        url: `${prefix}/simple`,
        method: "GET",
        params: args,
      }),
    }),
    affiliateLabsOffer: builder.mutation<
      IAffiliateLabsOfferDTO.Result,
      IAffiliateLabsOfferDTO.Args
    >({
      query: (args) => ({
        url: "affiliation-request",
        method: "POST",
        body: args,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "offers", id: "LIST" },
        { type: "offers", id: args.offerId },
      ],
    }),
    getLabsOfferGrouped: builder.query<
      IPostLabsOfferGroupedDTO.Result,
      IPostLabsOfferGroupedDTO.Args
    >({
      query: (args) => ({
        url: buildQueryString({ args, endpoint: "labs/offer/grouped" }),
        method: "get",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateLabsOfferMutation,
  useGetLabsOfferQuery,
  useGetLabsOfferByIdQuery,
  useDeleteLabsOfferMutation,
  useUpdateLabsOfferMutation,
  useFavoriteLabsOfferMutation,
  useGetLabsOfferSimpleQuery,
  useAffiliateLabsOfferMutation,
  useGetLabsOfferGroupedQuery,
} = labsOfferServices;
