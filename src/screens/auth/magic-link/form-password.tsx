import { useCreatePasswordMutation } from "@/services/user.service";
import { Controller, useForm } from "react-hook-form";
import {
  schemaForgotPassword,
  TSchemaForgotPasswordInput,
  TSchemaForgotPasswordOutput,
} from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateProgress, getProgressColor, validatePassword } from "@/utils/passwordUtils";
import { InputPassword } from "@/components/input-password";
import { cn, Popover, PopoverContent, PopoverTrigger, Progress } from "@heroui/react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export const FormPassword = ({
  temporaryToken,
  onSuccess,
}: {
  temporaryToken: string;
  onSuccess: () => void;
}) => {
  const [confirmPasswordChange, { isLoading }] = useCreatePasswordMutation();

  const { control, handleSubmit, watch } = useForm<
    TSchemaForgotPasswordInput,
    any,
    TSchemaForgotPasswordOutput
  >({
    resolver: zodResolver(schemaForgotPassword),
  });

  const onSubmit = (data: TSchemaForgotPasswordOutput) => {
    confirmPasswordChange({ temporaryToken, ...data })
      .unwrap()
      .then(() => {
        onSuccess();
      });
  };

  const password = watch("password");
  const verifyPassword = watch("verifyPassword");
  const valueProgress = calculateProgress(password);
  const colorProgress = getProgressColor(valueProgress);
  const validationResults = validatePassword(password);
  return (
    <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="password"
        render={({ field, fieldState: { invalid, error } }) => (
          <InputPassword
            {...field}
            label="Nova Senha"
            name="password"
            placeholder="Digite sua nova senha"
            isRequired
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="verifyPassword"
        render={({ field, fieldState: { invalid, error } }) => (
          <InputPassword
            {...field}
            label="Confirmar Senha"
            name="verifyPassword"
            placeholder="Confirme sua nova senha"
            isRequired
            isInvalid={invalid}
            errorMessage={error?.message}
            description={
              verifyPassword && password === verifyPassword && !error
                ? "As senhas conferem ✓"
                : undefined
            }
          />
        )}
      />
      {password && (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Progress
              aria-label="Força da senha"
              classNames={{
                track: "border-default border drop-shadow-md",
                indicator: `bg-gradient-to-r ${colorProgress}`,
                label: "text-default-600 font-medium tracking-wider",
                value: "text-foreground/60",
              }}
              label={
                valueProgress < 50
                  ? "Senha fraca"
                  : valueProgress < 75
                    ? "Senha média"
                    : "Senha forte"
              }
              showValueLabel={false}
              size="sm"
              value={valueProgress}
            />
          </div>
          <Popover showArrow placement="right-end">
            <PopoverTrigger>
              <Button
                isIconOnly
                className="size-6 min-h-6 min-w-6 max-w-6"
                variant="flat"
                size="sm"
              >
                <Icon icon="solar:info-circle-bold" width="20" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="px-6 py-4">
              <div className="flex w-full flex-col gap-2">
                <span className="text-lg">Sua senha deve conter:</span>
                <div className="flex flex-col gap-1">
                  {validationResults.map(({ message, isValid }) => (
                    <div key={message} className="flex items-center gap-2">
                      <Icon
                        className={cn([isValid ? "text-success" : "text-danger"])}
                        icon={isValid ? "solar:shield-check-bold" : "solar:shield-cross-bold"}
                        width={16}
                      />
                      <span className="text-small">{message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      <Button color="primary" type="submit" isLoading={isLoading}>
        Criar senha
      </Button>
    </form>
  );
};
