import z from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const schemaSettings = z.object({
  structure: z.array(z.string()).optional(),
  typeProduct: z.array(z.string()).optional(),
  typePages: z.array(z.string()).optional(),
  email: z.array(z.string()).optional(),
  excludedProducts: z.array(z.string()).optional(),
  excludedPages: z.array(z.string()).optional(),
  salesAngle: z.array(z.string()).optional(),
  supportPhone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const cleaned = val.replace(/\D/g, "");
        const finalValue = cleaned.startsWith("55") ? `+${cleaned}` : `+55${cleaned}`;
        const phoneNumber = parsePhoneNumberFromString(finalValue);
        return phoneNumber?.isValid() && phoneNumber?.country === "BR";
      },
      { message: "Telefone inválido para o Brasil" },
    ),
});

export type TSchemaSettingsInput = z.input<typeof schemaSettings>;
export type TSchemaSettingsOutput = z.output<typeof schemaSettings>;
