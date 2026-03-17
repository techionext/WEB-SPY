import z from "zod";

export const schemaCategory = z.object({
  title: z.string().min(1, { message: "Título é obrigatório" }),
  icon: z.string().optional(),
  image: z.instanceof(File).optional(),
});

export type SchemaCategoryInput = z.input<typeof schemaCategory>;
export type SchemaCategoryOutput = z.output<typeof schemaCategory>;
