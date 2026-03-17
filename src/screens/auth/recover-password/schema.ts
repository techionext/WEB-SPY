import { z } from "zod";
export const schemaForgotPassword = z
  .object({
    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
    verifyPassword: z.string(),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "As senhas não coincidem",
    path: ["verifyPassword"],
  });

export type TSchemaForgotPasswordInput = z.input<typeof schemaForgotPassword>;
export type TSchemaForgotPasswordOutput = z.output<typeof schemaForgotPassword>;
