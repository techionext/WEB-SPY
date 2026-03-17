import { api } from "@/libs/api";
import { ISeasonDTO, ISeasonIdDTO } from "@/types/season/season.type";

export namespace ISeasonCreate {
  export type Args = {
    title: string;
    current: boolean;
    startDate: string;
    endDate: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace ISeasonUpdate {
  export type Args = {
    id: string;
    title: string;
    current: boolean;
    startDate: string;
    endDate: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace ISeasonDelete {
  export type Args = {
    id: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export const seasonServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getSeason: builder.query<ISeasonDTO.Result, ISeasonDTO.Args>({
      query: (data) => ({
        url: "/season",
        method: "GET",
        params: data,
      }),
      providesTags: [{ type: "season", id: "list" }],
    }),
    getSeasonById: builder.query<ISeasonIdDTO.Result, ISeasonIdDTO.Args>({
      query: (data) => ({
        url: `/season/${data.id}`,
        method: "GET",
      }),
      providesTags: [{ type: "season", id: "current" }],
    }),
    createSeason: builder.mutation<ISeasonCreate.Result, ISeasonCreate.Args>({
      query: (data) => ({
        url: "/season",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "season", id: "list" }],
    }),
    updateSeason: builder.mutation<ISeasonUpdate.Result, ISeasonUpdate.Args>({
      query: (data) => ({
        url: `/season/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "season", id: "list" }],
    }),
    deleteSeason: builder.mutation<ISeasonDelete.Result, ISeasonDelete.Args>({
      query: (data) => ({
        url: `/season/${data.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "season", id: "list" }],
    }),
  }),
});

export const {
  useGetSeasonQuery,
  useGetSeasonByIdQuery,
  useCreateSeasonMutation,
  useUpdateSeasonMutation,
  useDeleteSeasonMutation,
} = seasonServices;
