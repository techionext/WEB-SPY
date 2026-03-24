import z from "zod";

export const schemaEditCreative = z.object({
  title: z
    .string({ message: "Título é obrigatório" })
    .min(3, { message: "Título deve ter no mínimo 3 caracteres" }),
  description: z.string().optional(),
  language: z.string({ message: "Idioma é obrigatório" }),
  isClimbing: z.boolean().default(false),
  trafficNetwork: z.string({ message: "Rede de tráfego é obrigatória" }),
  salesAngle: z.string().optional(),
  image: z.instanceof(File).optional(),
});

export type SchemaEditCreativeInput = z.input<typeof schemaEditCreative>;
export type SchemaEditCreativeOutput = z.output<typeof schemaEditCreative>;
