import z from "zod";

export const schemaCommunityArea = z.object({
  title: z.string().min(1, { message: "Título é obrigatório" }),
  image: z.instanceof(File).optional(),
});

export type SchemaCommunityAreaInput = z.input<typeof schemaCommunityArea>;
export type SchemaCommunityAreaOutput = z.output<typeof schemaCommunityArea>;
