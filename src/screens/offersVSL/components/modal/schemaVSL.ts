import z from "zod";

export const schemaVSL = z.object({
  title: z
    .string({ message: "Título é obrigatório" })
    .min(3, { message: "Título deve ter no mínimo 3 caracteres" }),
  description: z.string().optional(),
  transcription: z
    .union([z.instanceof(File), z.object({ id: z.string(), text: z.string() })])
    .optional(),
});

export type SchemaVSLInput = z.input<typeof schemaVSL>;
export type SchemaVSLOutput = z.output<typeof schemaVSL>;
