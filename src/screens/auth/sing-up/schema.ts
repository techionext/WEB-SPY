import z from "zod";

export const schemaSignUp = z
  .object({
    name: z.string().min(3, { message: "Name is required" }),
    email: z.email({ message: "Email is required" }),
    password: z.string().min(8, { message: "Password is required" }),
    phone: z
      .string()
      .min(10, { message: "Phone is required" })
      .transform((value) => {
        const onlyNumbers = value.replace(/\D/g, "");
        return JSON.stringify({
          country: "55",
          ddd: onlyNumbers.slice(0, 2),
          number: onlyNumbers.slice(2),
        });
      }),
    verifyPassword: z.string().min(8, { message: "Verify password is required" }),
    terms: z.boolean({ message: "Terms is required" }).default(true),
  })
  .required({
    name: true,
    email: true,
    password: true,
    verifyPassword: true,
    terms: true,
    phone: true,
  });

export type TSchemaSignUp = z.input<typeof schemaSignUp>;
export type TSchemaSignUpOutput = z.output<typeof schemaSignUp>;
