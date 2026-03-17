import { Field } from "@/components/field/field";
import { usePostUserInviteMutation } from "@/services/user.service";
import { setMask } from "@agenus/utils";
import {
  Modal,
  ModalHeader,
  ModalContent,
  useDisclosure,
  Button,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const schema = z
  .object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    email: z.string().email({ message: "Email é obrigatório" }),
    phone: z
      .string({ error: "Celular é obrigatório." })
      .trim()
      .regex(
        /^\([1-9]{2}\) 9[0-9][0-9]{3}-[0-9]{4}$/,
        "O telefone deve incluir código de área e número válido.",
      )
      .transform((phone) => phone.replace(/\D/g, ""))
      .transform((phone) => {
        const country = "55";
        const ddd = phone.slice(0, 2);
        const number = phone.slice(2);

        return {
          country,
          ddd,
          number,
        };
      }),
  })
  .superRefine((data, ctx) => {
    if (!data.phone) return;
    const { country, ddd, number } = data.phone;
    const c = String(country ?? "").trim();
    const d = String(ddd ?? "").trim();
    const n = String(number ?? "").trim();
    const anyFilled = c !== "" || d !== "" || n !== "";
    if (!anyFilled) return;
    if (c === "")
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "DDI é obrigatório",
        path: ["phone", "country"],
      });
    if (d === "")
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "DDD é obrigatório",
        path: ["phone", "ddd"],
      });
    if (n === "")
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Número é obrigatório",
        path: ["phone", "number"],
      });
  });

export type TSchemaInviteUser = z.input<typeof schema>;
export type TSchemaInviteUserOutput = z.output<typeof schema>;

export const ModalInviteUser = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [inviteUser, { isLoading }] = usePostUserInviteMutation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TSchemaInviteUser, any, TSchemaInviteUserOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });
  const handleClose = () => {
    reset();
    onOpenChange();
  };

  const onSubmit = (formData: TSchemaInviteUserOutput) => {
    inviteUser(formData)
      .unwrap()
      .then(() => {
        handleClose();
      });
  };

  return (
    <>
      <Button color="primary" onPress={onOpen} startContent={<Icon icon="mdi:user-plus" />}>
        Convidar usuário
      </Button>
      <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              <span className="text-xl font-semibold">Convite de usuário</span>
            </ModalHeader>
            <ModalBody className="p-4">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Field
                    {...field}
                    label="Nome"
                    placeholder="Nome do usuário"
                    errorMessage={errors.name?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Field
                    {...field}
                    label="Email"
                    placeholder="Email do usuário"
                    errorMessage={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field, fieldState: { invalid, error } }) => (
                  <Field
                    {...field}
                    errorMessage={error?.message}
                    isInvalid={invalid}
                    label="Telefone"
                    placeholder="Digite o telefone"
                    startContent={
                      <div className="flex w-fit items-center border-r pr-2">
                        <div className="flex items-end gap-2">
                          <div className="size-6 min-w-6 flex items-center justify-center">
                            <Icon icon="circle-flags:br" />
                          </div>
                          <p className="font-bold">{+55}</p>
                        </div>
                      </div>
                    }
                    type="phone"
                    onChange={(v) =>
                      field.onChange(
                        setMask({
                          type: "phone",
                          value: v.target.value,
                        }) ?? "",
                      )
                    }
                  />
                )}
              />
            </ModalBody>

            <ModalFooter className="border-t border-default-200">
              <Button variant="flat" onPress={handleClose} isDisabled={isLoading}>
                Cancelar
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading} isDisabled={isLoading}>
                Convidar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
