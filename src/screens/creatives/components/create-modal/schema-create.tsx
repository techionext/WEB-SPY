import z from "zod";

export const schemaCreateCreative = z.object({
  title: z
    .string({ message: "Título é obrigatório" })
    .min(3, { message: "Título deve ter no mínimo 3 caracteres" }),
  description: z.string().optional(),
  language: z.string({ message: "Idioma é obrigatório" }),
  isClimbing: z.boolean().default(false),
  trafficNetwork: z.string({ message: "Rede de tráfego é obrigatória" }),
  salesAngle: z.string().optional(),
  creationType: z.string().optional(),
  valueToday: z.number().optional(),
  image: z.instanceof(File, { message: "Conteúdo é obrigatória" }),
  offerId: z.string({ message: "Oferta é obrigatória" }),
  pageId: z.string().optional(),
});

export type SchemaCreateCreativeInput = z.input<typeof schemaCreateCreative>;
export type SchemaCreateCreativeOutput = z.output<typeof schemaCreateCreative>;
