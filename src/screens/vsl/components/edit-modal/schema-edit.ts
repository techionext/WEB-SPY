import z from "zod";

export const schemaEditVSL = z.object({
  title: z
    .string({ message: "Título é obrigatório" })
    .min(3, { message: "Título deve ter no mínimo 3 caracteres" }),
  description: z.string().optional(),
  video: z.instanceof(File).optional(),
  transcription: z
    .union([z.instanceof(File), z.any()])
    .optional(),
});

export type SchemaEditVSLInput = z.input<typeof schemaEditVSL>;
export type SchemaEditVSLOutput = z.output<typeof schemaEditVSL>;
