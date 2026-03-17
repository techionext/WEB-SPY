import { api } from "@/libs/api";
import {
  ICreateProducerDTO,
  IProducerDTO,
  IUpdateProducerDTO,
} from "@/types/community/settings/producer.type";
import { convertToFormData } from "@/utils/converteToFormData";
import { buildQueryString } from "@/utils/generateUrlWithParams";

const prefix = "community/content-creator";
export const producerServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducers: builder.query<IProducerDTO.Result, IProducerDTO.Args>({
      query: (args) => ({
        url: buildQueryString({ args, endpoint: prefix }),
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              { type: "producer" as const, id: "LIST" },
              ...result.data.map((producer) => ({
                type: "producer" as const,
                id: producer.id,
              })),
            ]
          : [{ type: "producer" as const, id: "LIST" }],
    }),
    createProducer: builder.mutation<ICreateProducerDTO.Result, ICreateProducerDTO.Args>({
      query: (args) => ({
        url: prefix,
        method: "POST",
        body: convertToFormData(args),
      }),
      invalidatesTags: [
        { type: "producer", id: "LIST" },
        { type: "community-video-group", id: "LIST" },
      ],
    }),
    updateProducer: builder.mutation<IUpdateProducerDTO.Result, IUpdateProducerDTO.Args>({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "PUT",
        body: convertToFormData(args),
      }),
      invalidatesTags: [
        { type: "producer", id: "LIST" },
        { type: "community-video-group", id: "LIST" },
      ],
    }),
    deleteProducer: builder.mutation<{ codeIntern: string; message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "producer", id: "LIST" },
        { type: "community-video-group", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProducersQuery,
  useCreateProducerMutation,
  useUpdateProducerMutation,
  useDeleteProducerMutation,
} = producerServices;
