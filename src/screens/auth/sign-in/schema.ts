import z from "zod";

export const schemaSignIn = z
  .object({
    email: z.email({ message: "Email is required" }),
    password: z.string().min(8, { message: "Password is required" }),
  })
  .required({
    email: true,
    password: true,
  });

export type TSchemaSignIn = z.input<typeof schemaSignIn>;
