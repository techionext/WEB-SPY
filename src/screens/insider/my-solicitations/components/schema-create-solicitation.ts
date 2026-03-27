import z from "zod";

export const schemaCreateSolicitation = z.object({
  title: z.string().optional(),
  libraryUrl: z.string().optional(),
  type: z.enum(["SIMPLE", "ADVANCED"]),
  observation: z.string().optional(),
  userInsiderId: z.string().optional(),
  offerId: z.string().optional(),
  pageId: z.string().optional(),
});

export type TSchemaCreateSolicitationInput = z.input<typeof schemaCreateSolicitation>;
export type TSchemaCreateSolicitationOutput = z.output<typeof schemaCreateSolicitation>;
