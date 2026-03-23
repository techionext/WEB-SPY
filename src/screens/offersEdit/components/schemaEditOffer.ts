import z from "zod";
import { TrafficNetwork } from "@/types/offer/offer.type";

export const schemaEditOffer = z.object({
  title: z
    .string({ error: "Título é obrigatório" })
    .min(3, { message: "Título deve ter no mínimo 3 caracteres" }),
  description: z.string().optional(),
  trafficNetwork: z.nativeEnum(TrafficNetwork, {
    message: "Rede de tráfego é obrigatória",
  }),
  structure: z
    .string({ error: "Estrutura é obrigatório" })
    .min(1, { message: "Estrutura é obrigatório" }),
  language: z.string({ error: "Idioma é obrigatório" }).min(1, { message: "Idioma é obrigatório" }),
  typeProduct: z
    .string({ error: "Tipo de produto é obrigatório" })
    .min(1, { message: "Tipo de produto é obrigatório" }),
  categoryId: z
    .string({ error: "Categoria é obrigatório" })
    .min(1, { message: "Categoria é obrigatório" }),
  isClimbing: z.boolean().default(false),
  isCloaker: z.boolean().default(false),
  filter: z.string().optional(),
  image: z.instanceof(File).optional(),
  pitch: z.string().optional(),
});

export type SchemaEditOfferInput = z.input<typeof schemaEditOffer>;
export type SchemaEditOfferOutput = z.output<typeof schemaEditOffer>;
