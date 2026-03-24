import z from "zod";

export const schemaArchive = z.object({
  archiveReason: z
    .string({ message: "O motivo é obrigatório" })
    .min(5, { message: "O motivo deve ter no mínimo 5 caracteres" }),
});

export type SchemaArchiveInput = z.input<typeof schemaArchive>;
export type SchemaArchiveOutput = z.output<typeof schemaArchive>;
