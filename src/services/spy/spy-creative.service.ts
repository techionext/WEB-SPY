import { api } from "@/libs/api";
import {
  ISpyCreativeGroupedDTO,
  ISpyCreativesDTO,
  ISpyCreativeTranscriptionDTO,
} from "@/types/spy/spy-creative.type";

const prefix = "/creative";
export const spyCreativeServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getSpyCreatives: builder.query<ISpyCreativesDTO.Result, ISpyCreativesDTO.Args>({
      query: (args) => ({
        url: `${prefix}`,
        method: "GET",
        params: args,
      }),
      providesTags: (result) => [
        { type: "spyCreatives" as const, id: "list" },
        ...(result?.data.map((item) => ({ type: "spyCreatives" as const, id: item.id })) ?? []),
      ],
    }),
    getSpyCreativeGrouped: builder.query<
      ISpyCreativeGroupedDTO.Result,
      ISpyCreativeGroupedDTO.Args
    >({
      query: (args) => ({
        url: `${prefix}/grouped`,
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "spyOffers", id: "list" }],
    }),
    postSpyCreativeTranscription: builder.mutation<
      ISpyCreativeTranscriptionDTO.Result,
      ISpyCreativeTranscriptionDTO.Args
    >({
      query: (args) => ({
        url: `${prefix}/${args.id}/transcription`,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: "spyCreatives", id: "list" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSpyCreativesQuery,
  useGetSpyCreativeGroupedQuery,
  usePostSpyCreativeTranscriptionMutation,
} = spyCreativeServices;
