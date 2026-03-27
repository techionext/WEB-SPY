import { api } from "@/libs/api";

export type IAnalysisRequest = {
  user: {
    name: string;
    id: string;
    email: string;
    avatar: {
      id: string;
      url: string;
      mimeType: string;
      key: string;
    };
  };
  totalFiles: number;
  offer: {
    image: {
      id: string;
      url: string;
      mimeType: string;
      key: string;
    };
    id: string;
    title: string;
  };
  id: string;
  libraryUrl: string;
  image: {
    id: string;
    url: string;
    mimeType: string;
    key: string;
  };
  type: "SIMPLE" | "ADVANCED";
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  title: string;
  observation: string;
  offerId: string;
  createdAt: string;
  updatedAt: string;
};

export namespace IAnalysisRequestGetDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
    users?: string[];
    offers?: string[];
    viewType?: "INSIDER" | "BENCHMARK";
    status?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
    type?: "SIMPLE" | "ADVANCED";
  };
  export type Result = {
    data: IAnalysisRequest[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export namespace IAnalysisRequestPostDTO {
  export type Args = {
    title: string;
    libraryUrl?: string;
    type: "SIMPLE" | "ADVANCED";
    observation?: string;
    offerId?: string;
    pageId?: string;
    userInsiderId?: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
    id: string;
  };
}

export namespace IAnalysisRequestGetByIdDTO {
  export type Args = {
    id: string;
  };
  export type Result = {
    userInsider: {
      name: string;
      id: string;
      email: string;
      avatar: {
        id: string;
        url: string;
        mimeType: string;
        key: string;
      };
    };
    userBenchmark: {
      name: string;
      id: string;
      email: string;
      avatar: {
        id: string;
        url: string;
        mimeType: string;
        key: string;
      };
    };
    offer: {
      id: string;
      title: string;
      image: {
        id: string;
        url: string;
        mimeType: string;
        key: string;
      };
    };
    file: [
      {
        id: string;
        url: string;
        size: 0;
        originalName: string;
        mimeType: string;
        key: string;
      },
    ];
    id: string;
    title: string;
    libraryUrl: string;
    type: "SIMPLE" | "ADVANCED";
    description: string;
    observation: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
    offerId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export namespace IAnalysisMetricsDTO {
  export type Args = {
    viewType?: "INSIDER" | "BENCHMARK";
    status?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
    type?: "SIMPLE" | "ADVANCED";
    offers?: string[];
    users?: string[];
    page?: number;
    pageSize?: number;
  };
  export type Result = {
    CANCELLED: number;
    COMPLETED: number;
    FAILED: number;
    PENDING: number;
    PROCESSING: number;
  };
}

export namespace IAnalysisUpdateDTO {
  export type Args = {
    id: string;
    observation?: string;
    type?: "SIMPLE" | "ADVANCED";
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IAnalysisAddFileDTO {
  export type Args = {
    id: string;
    file: File;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IAnalysisRemoveFileDTO {
  export type Args = {
    id: string;
    fileId: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IAnalysisRequestPatchDTO {
  export type Args = {
    id: string;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export type IAnalysisRequestGrouped = {
  status: Record<string, number>;
  type: Record<string, number>;
  user: Record<string, number>;
  offer: Record<string, number>;
};

export namespace IAnalysisRequestGroupedDTO {
  export type Args = {
    status?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
    type?: "SIMPLE" | "ADVANCED";
    users?: string[];
    offers?: string[];
    viewType?: "INSIDER" | "BENCHMARK";
  };
  export type Result = IAnalysisRequestGrouped;
}

const prefix = "/analysis-request";

export const analysisRequestServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getAnalysisRequest: builder.query<IAnalysisRequestGetDTO.Result, IAnalysisRequestGetDTO.Args>({
      query: (args) => ({
        url: `${prefix}`,
        method: "GET",
        params: args,
      }),
      providesTags: [
        { type: "analysis-requests", id: "list" },
        { type: "analysis-requests-files", id: "files" },
      ],
    }),
    postAnalysisRequest: builder.mutation<
      IAnalysisRequestPostDTO.Result,
      IAnalysisRequestPostDTO.Args
    >({
      query: (args) => ({
        url: `${prefix}`,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: "analysis-requests", id: "list" }],
    }),
    getAnalysisRequestById: builder.query<
      IAnalysisRequestGetByIdDTO.Result,
      IAnalysisRequestGetByIdDTO.Args
    >({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "GET",
      }),
      providesTags: (result, error, args) => [
        { type: "analysis-requests", id: args.id },
        { type: "analysis-requests-files", id: args.id },
      ],
    }),
    updateAnalysisRequest: builder.mutation<IAnalysisUpdateDTO.Result, IAnalysisUpdateDTO.Args>({
      query: (args) => ({
        url: `${prefix}/${args.id}`,
        method: "PUT",
        body: args,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "analysis-requests", id: args.id },
        { type: "analysis-requests-files", id: args.id },
      ],
    }),
    addAnalysisRequestFile: builder.mutation<IAnalysisAddFileDTO.Result, IAnalysisAddFileDTO.Args>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `${prefix}/${id}/file`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, args) => [
        // Garante refetch da lista usada no item-card
        { type: "analysis-requests", id: "list" },
        { type: "analysis-requests-files", id: "files" },
        { type: "analysis-requests", id: args.id },
        { type: "analysis-requests-files", id: args.id },
        { type: "analysis-requests", id: "metrics" },
      ],
    }),
    removeAnalysisRequestFile: builder.mutation<
      IAnalysisRemoveFileDTO.Result,
      IAnalysisRemoveFileDTO.Args
    >({
      query: (args) => ({
        url: `${prefix}/${args.id}/file`,
        method: "DELETE",
        body: {
          fileId: args.fileId,
        },
      }),
      invalidatesTags: (result, error, args) => [
        { type: "analysis-requests", id: "list" },
        { type: "analysis-requests-files", id: "files" },
        { type: "analysis-requests-files", id: args.id },
        { type: "analysis-requests", id: "metrics" },
      ],
    }),
    patchAnalysisRequest: builder.mutation<
      IAnalysisRequestPatchDTO.Result,
      IAnalysisRequestPatchDTO.Args
    >({
      query: (args) => ({
        url: `${prefix}/${args.id}/status`,
        method: "PATCH",
        body: args,
      }),
      invalidatesTags: (result, error, args) => [
        { type: "analysis-requests", id: "list" },
        { type: "analysis-requests-files", id: "files" },
        { type: "analysis-requests", id: args.id },
        { type: "analysis-requests", id: "metrics" },
      ],
    }),
    getAnalysisMetrics: builder.query<IAnalysisMetricsDTO.Result, IAnalysisMetricsDTO.Args>({
      query: (args) => ({
        url: `${prefix}/metrics/summary`,
        method: "GET",
        params: args,
      }),
      providesTags: [{ type: "analysis-requests", id: "metrics" }],
    }),
    getAnalysisRequestGrouped: builder.query<
      IAnalysisRequestGroupedDTO.Result,
      IAnalysisRequestGroupedDTO.Args
    >({
      query: (args) => ({
        url: `${prefix}/grouped`,
        method: "GET",
        params: args,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAnalysisRequestQuery,
  usePostAnalysisRequestMutation,
  useGetAnalysisRequestByIdQuery,
  useUpdateAnalysisRequestMutation,
  useAddAnalysisRequestFileMutation,
  useRemoveAnalysisRequestFileMutation,
  usePatchAnalysisRequestMutation,
  useGetAnalysisMetricsQuery,
  useGetAnalysisRequestGroupedQuery,
} = analysisRequestServices;
