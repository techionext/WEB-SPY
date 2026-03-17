"use client";

import React from "react";
import { Button, Divider, Input, Link } from "@heroui/react";

import { InputPassword } from "@/components/input-password";
import { Controller, useForm } from "react-hook-form";
import { schemaSignIn, TSchemaSignIn } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthLoginMutation } from "@/services/user.service";
import { Icon } from "@iconify/react";
import { CardAuth } from "@/components/card-auth";

export const ScreenAuthSignIn = () => {
  const { control, handleSubmit } = useForm<TSchemaSignIn>({
    resolver: zodResolver(schemaSignIn),
  });

  const [authLogin, { isLoading }] = useAuthLoginMutation();

  const onSubmit = (data: TSchemaSignIn) => {
    authLogin(data)
      .unwrap()
      .then((res) => {
        if (res.token) {
          window.location.href = "/spy";
        }
      });
  };

  return (
    <div className="flex flex-col gap-4">
      <CardAuth>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2 size-10 bg-content2 text-default-500  font-bold  justify-center rounded-full text-[10px]">
              <p>H&W</p>
            </div>
            <h1 className="text-2xl font-bold">Bem vindo de volta</h1>
            <p className="text-balance text-muted-foreground">Acesse sua conta HUBWISE</p>
          </div>
          <div className="flex flex-col gap-3">
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState: { invalid, error } }) => (
                <Input
                  {...field}
                  labelPlacement="outside"
                  label="Email"
                  name="email"
                  placeholder="username@example.com"
                  type="email"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-small ">Senha</p>
                <Link className="text-default-500" href="/auth/forgot-password" size="sm">
                  Esqueceu a senha?
                </Link>
              </div>
              <Controller
                control={control}
                name="password"
                render={({ field, fieldState: { invalid, error } }) => (
                  <InputPassword
                    label={undefined}
                    {...field}
                    isInvalid={invalid}
                    errorMessage={error?.message}
                  />
                )}
              />
            </div>

            <Button color="primary" type="submit" isLoading={isLoading}>
              Entrar
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Divider className="flex-1" />
              <p className="text-small text-center">Acessar comunidade</p>
              <Divider className="flex-1" />
            </div>
            <div className="flex gap-2">
              <Button variant="flat" fullWidth>
                <Icon icon="logos:discord-icon" width={20} />
              </Button>
              <Button variant="flat" fullWidth>
                <Icon icon="logos:whatsapp-icon" width={20} />
              </Button>
            </div>
          </div>
        </form>
      </CardAuth>
      <p className="text-small text-center text-default-500">
        Ao continuar, você concorda com nossos{" "}
        <Link className="text-small" href="#">
          Termos de Serviço
        </Link>{" "}
        e{" "}
        <Link className="text-small" href="#">
          Política de Privacidade
        </Link>
        .
      </p>
    </div>
  );
};
