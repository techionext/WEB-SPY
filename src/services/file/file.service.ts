import { api } from "@/libs/api";

export const fileServices = api.injectEndpoints({
  endpoints: (builder) => ({
    fileSignedUrl: builder.mutation<{ url: string }, { id: string }>({
      query: (args) => ({
        url: `/file/${args.id}/signed-url`,
        method: "POST",
      }),
    }),
  }),

  overrideExisting: true,
});

export const { useFileSignedUrlMutation } = fileServices;
