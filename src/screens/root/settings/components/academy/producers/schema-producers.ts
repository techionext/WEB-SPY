import z from "zod";

export const schemaProducer = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  image: z.instanceof(File).optional(),
});

export type SchemaProducerInput = z.input<typeof schemaProducer>;
export type SchemaProducerOutput = z.output<typeof schemaProducer>;
