import { z } from "zod";

const phoneSchema = z
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
  });

export const schemaUser = z.object({
  name: z.string(),
  phone: phoneSchema,
});

export type TSchemaUserInput = z.input<typeof schemaUser>;
export type TSchemaUserOutput = z.output<typeof schemaUser>;
