"use client";

import React from "react";
import { Button, cn, Link, Popover, PopoverContent, PopoverTrigger, Progress } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputPassword } from "@/components/input-password";
import {
  useConfirmPasswordChangeMutation,
  useValidatePasswordChangeQuery,
} from "@/services/user.service";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import {
  schemaForgotPassword,
  TSchemaForgotPasswordInput,
  TSchemaForgotPasswordOutput,
} from "./schema";
import { calculateProgress, getProgressColor, validatePassword } from "@/utils/passwordUtils";
import { CardAuth } from "@/components/card-auth";

export const ScreenAuthRecoverPassword = () => {
  const { push } = useRouter();
  const { id } = useParams<{ id: string }>();
  const { isError, data } = useValidatePasswordChangeQuery({ id }, { skip: false });

  const [confirmPasswordChange, { isLoading }] = useConfirmPasswordChangeMutation();

  const { control, handleSubmit, watch } = useForm<
    TSchemaForgotPasswordInput,
    any,
    TSchemaForgotPasswordOutput
  >({
    resolver: zodResolver(schemaForgotPassword),
  });

  const onSubmit = (data: TSchemaForgotPasswordOutput) => {
    confirmPasswordChange({ id, ...data }).then((res) => {
      if (res.data) {
        push("/auth/sign-in");
      }
    });
  };

  const password = watch("password");
  const verifyPassword = watch("verifyPassword");
  const valueProgress = calculateProgress(password);
  const colorProgress = getProgressColor(valueProgress);
  const validationResults = validatePassword(password);

  if (isError) {
    return (
      <div>
        <div className="flex flex-col gap-2 pb-2 items-center text-center">
          <Icon icon="solar:shield-warning-bold-duotone" className="text-warning" width={42} />
          <p className="text-xl font-medium">Link Expirado ou Inválido</p>
          <p className="text-small text-default-500">
            Este link de redefinição de senha expirou ou é inválido. Por favor, solicite um novo
            para continuar.
          </p>
        </div>
        <Button as={Link} href="/auth/recovery-password" color="primary" className="w-full">
          Solicitar Novo Link
        </Button>
        <p className="text-small text-center">
          Lembra da senha?&nbsp;
          <Link href="/auth/sign-in" size="sm">
            Entrar
          </Link>
        </p>
      </div>
    );
  }

  return (
    <CardAuth>
      {data?.isValid ? (
        <div className="flex w-full  flex-col gap-4   justify-center h-full">
          <div className="flex flex-col gap-2 pb-2 items-center text-center">
            <div className="flex items-center gap-2 size-10 bg-content2 text-default-500  font-bold  justify-center rounded-full text-[10px]">
              <p>H&W</p>
            </div>
            <p className="text-xl font-medium">Redefinir Senha</p>
            <p className="text-small text-default-500">
              Digite sua nova senha para redefinir sua conta.
            </p>
          </div>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
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
                  color={
                    verifyPassword && password === verifyPassword && !error ? "success" : undefined
                  }
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
              Redefinir Senha
            </Button>
          </form>
          <p className="text-small text-center">
            Lembra da senha?&nbsp;
            <Link href="/auth/sign-in" size="sm">
              Entrar
            </Link>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center justify-center h-full">
          <div className="flex flex-col gap-2 pb-2 items-center text-center">
            <div className="p-2 bg-content2 text-default-500  font-bold  justify-center rounded-full text-[10px]">
              <Icon icon="solar:shield-warning-bold-duotone" className="text-warning" width={42} />
            </div>
            <p className="text-xl font-medium">Link Expirado ou Inválido</p>
            <p className="text-small text-default-500">
              Este link de redefinição de senha expirou ou é inválido. Por favor, solicite um novo
              para continuar.
            </p>
          </div>
          <Button
            as={Link}
            href="/auth/forgot-password"
            color="primary"
            className="w-full bg-linear-to-r from-primary to-primary-300/40"
          >
            Solicitar Novo Link
          </Button>
          <p className="text-small text-center">
            Lembra da senha?&nbsp;
            <Link href="/auth/sign-in" size="sm">
              Entrar
            </Link>
          </p>
        </div>
      )}
    </CardAuth>
  );
};
