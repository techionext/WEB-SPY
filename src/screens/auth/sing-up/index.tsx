"use client";

import React from "react";
import {
  Button,
  Input,
  Checkbox,
  Link,
  Divider,
  Progress,
  Popover,
  PopoverTrigger,
  PopoverContent,
  cn,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { InputPassword } from "@/components/input-password";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { schemaSignUp, TSchemaSignUp, TSchemaSignUpOutput } from "./schema";
import { setMask } from "@agenus/utils";
import { useSingUpMutation } from "@/services/user.service";
import { calculateProgress, getProgressColor, validatePassword } from "@/utils/passwordUtils";

export const ScreenAuthSignUp = () => {
  const { control, handleSubmit, watch } = useForm<TSchemaSignUp, any, TSchemaSignUpOutput>({
    resolver: zodResolver(schemaSignUp),
  });

  const [singUp, { isLoading }] = useSingUpMutation();

  const onSubmit = (data: TSchemaSignUpOutput) => {
    singUp(data);
  };

  const password = watch("password");
  const verifyPassword = watch("verifyPassword");
  const valueProgress = calculateProgress(password);
  const colorProgress = getProgressColor(valueProgress);
  const validationResults = validatePassword(password);

  return (
    <div className="rounded-large bg-content1 shadow-small flex w-full max-w-sm flex-col gap-4 px-8 pt-6 pb-10">
      <p className="pb-2 text-xl font-medium">Cadastrar</p>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              label="Nome"
              placeholder="Digite seu nome"
              type="text"
              isRequired
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              label="Endereço de E-mail"
              name="email"
              placeholder="Digite seu e-mail"
              isRequired
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState: { invalid, error } }) => (
            <Input
              {...field}
              label="Telefone"
              name="phone"
              placeholder="Digite seu telefone"
              isRequired
              isInvalid={invalid}
              errorMessage={error?.message}
              onChange={(e) => {
                field.onChange(
                  setMask({
                    type: "phone",
                    value: e.target.value.replace(/\D/g, "") ?? "",
                  }) ?? "",
                );
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState: { invalid, error } }) => (
            <InputPassword
              {...field}
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
              isRequired
              isInvalid={invalid}
              errorMessage={error?.message}
              label="Confirmar Senha"
              placeholder="Confirme sua senha"
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
        <Checkbox className="py-4" size="sm">
          Eu concordo com os&nbsp;
          <Link className="relative z-1" href="#" size="sm">
            Termos
          </Link>
          &nbsp;e&nbsp;
          <Link className="relative z-1" href="#" size="sm">
            Política de Privacidade
          </Link>
        </Checkbox>
        <Button color="primary" type="submit" isLoading={isLoading}>
          Cadastrar
        </Button>
      </form>
      <div className="flex items-center gap-4 py-2">
        <Divider className="flex-1" />
        <p className="text-tiny text-default-500 shrink-0">OU</p>
        <Divider className="flex-1" />
      </div>
      <div className="flex flex-col gap-2">
        <Button startContent={<Icon icon="flat-color-icons:google" width={24} />}>
          Cadastrar com Google
        </Button>
      </div>
      <p className="text-small text-center">
        Já tem uma conta?&nbsp;
        <Link href="/auth/sign-in" size="sm">
          Entrar
        </Link>
      </p>
    </div>
  );
};
