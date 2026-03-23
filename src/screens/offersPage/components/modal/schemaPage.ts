import z from "zod";

export const schemaPage = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  file: z.instanceof(File).optional(),
  url: z.string().optional(),
  type: z
    .string({ error: "Tipo é obrigatório" })
    .min(3, { message: "Tipo deve ter no mínimo 3 caracteres" }),
  image: z.instanceof(File).optional(),
  makeScraper: z.boolean().default(false),
});

export type SchemaPageInput = z.input<typeof schemaPage>;
export type SchemaPageOutput = z.output<typeof schemaPage>;
