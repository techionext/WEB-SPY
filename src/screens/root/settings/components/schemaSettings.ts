import z from "zod";

export const schemaSettings = z.object({
  structure: z.array(z.string()).optional(),
  funnel: z.array(z.string()).optional(),
  typeProduct: z.array(z.string()).optional(),
  typePages: z.array(z.string()).optional(),
  videoCategory: z.array(z.string()).optional(),
  email: z.array(z.string()).optional(),
  excludedProducts: z.array(z.string()).optional(),
  excludedPages: z.array(z.string()).optional(),
});

export type TSchemaSettingsInput = z.input<typeof schemaSettings>;
export type TSchemaSettingsOutput = z.output<typeof schemaSettings>;
