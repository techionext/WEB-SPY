import z from "zod";

export const schemaSeason = z
  .object({
    title: z.string().min(1, { message: "Título é obrigatório" }),
    current: z.boolean().default(false),
    startDate: z.string().min(1, { message: "Data de início é obrigatória" }),
    endDate: z.string().min(1, { message: "Data de fim é obrigatória" }),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "Data de fim deve ser maior ou igual à data de início",
      path: ["endDate"],
    },
  );

export type SchemaSeasonInput = z.input<typeof schemaSeason>;
export type SchemaSeasonOutput = z.output<typeof schemaSeason>;
