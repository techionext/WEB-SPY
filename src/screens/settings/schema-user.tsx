import { z } from "zod";

export const schemaUser = z.object({
  name: z.string(),
  phone: z
    .string()
    .trim()
    .transform((v) => {
      const value = v.replace(/\D/g, "");

      if (value.length < 10 || value.length > 11) {
        throw new Error("Número de celular inválido");
      }

      const ddd = value.substring(0, 2);
      const number = value.substring(2);

      return {
        country: "55",
        ddd,
        number,
      };
    }),
  document: z.string().optional(),
  documentType: z.enum(["CPF", "CNPJ"]).optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zip: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
  rankingName: z.string().optional(),
});

export type TSchemaUserInput = z.input<typeof schemaUser>;
export type TSchemaUserOutput = z.output<typeof schemaUser>;
