"use client";

import relativeTime from "dayjs/plugin/relativeTime";

import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Link } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRequestPasswordChangeMutation } from "@/services/user.service";
import { CardAuth } from "@/components/card-auth";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

/** Tempo em segundos que o usuário deve aguardar antes de poder solicitar um novo link */
const COOLDOWN_RESEND_SECONDS = 60;

const schemaRecoveryPassword = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type TSchemaRecoveryPasswordInput = z.input<typeof schemaRecoveryPassword>;
type TSchemaRecoveryPasswordOutput = z.output<typeof schemaRecoveryPassword>;

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export const ScreenAuthForgotPassword = () => {
  const { control, handleSubmit, getValues } = useForm<
    TSchemaRecoveryPasswordInput,
    any,
    TSchemaRecoveryPasswordOutput
  >({
    resolver: zodResolver(schemaRecoveryPassword),
  });

  const [requestPasswordChange, { isLoading, isSuccess, fulfilledTimeStamp }] =
    useRequestPasswordChangeMutation();

  /** Segundos restantes para poder solicitar novo envio (countdown regressivo) */
  const [countdown, setCountdown] = useState(0);
  const countdownValueRef = useRef(0);
  const countdownSpanRef = useRef<HTMLSpanElement>(null);

  const onSubmit = (data: TSchemaRecoveryPasswordOutput) => {
    requestPasswordChange(data).unwrap();
  };

  // Inicia o countdown quando a primeira solicitação é bem-sucedida
  useEffect(() => {
    if (!isSuccess || !fulfilledTimeStamp) return;
    const elapsed = Math.floor((Date.now() - fulfilledTimeStamp) / 1000);
    const remaining = Math.max(0, COOLDOWN_RESEND_SECONDS - elapsed);
    setCountdown(remaining);
  }, [isSuccess, fulfilledTimeStamp]);

  // Timer regressivo: atualiza só o texto no DOM (sem setState) para não causar re-render a cada segundo
  useEffect(() => {
    if (!isSuccess || countdown <= 0) return;

    countdownValueRef.current = countdown;
    if (countdownSpanRef.current) {
      countdownSpanRef.current.textContent = formatCountdown(countdown);
    }

    const timer = setInterval(() => {
      countdownValueRef.current -= 1;
      const value = countdownValueRef.current;

      if (countdownSpanRef.current) {
        countdownSpanRef.current.textContent = formatCountdown(value);
      }

      if (value <= 0) {
        clearInterval(timer);
        setCountdown(0); // único re-render: habilita o botão "Solicitar novo link"
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccess, countdown]);

  const ContentRequestPassword = () => {
    return (
      <div className="flex flex-col gap-6 h-full justify-center ">
        <div className="flex flex-col items-center gap-2 pb-2 text-center">
          <div className="flex items-center gap-2 size-10 bg-content2 text-default-500  font-bold  justify-center rounded-full text-[10px]">
            <p>H&W</p>
          </div>
          <p className="text-xl font-medium">Esqueceu a Senha?</p>
          <p className="text-small text-default-500">
            Digite seu endereço de e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                label="Endereço de E-mail"
                name="email"
                placeholder="Digite seu e-mail"
                type="email"
                isRequired
                isInvalid={invalid}
                errorMessage={error?.message}
              />
            )}
          />
          <Button color="primary" type="submit" isLoading={isLoading}>
            Enviar Link de Recuperação
          </Button>
        </form>
        <p className="text-small text-center">
          Lembra da senha?&nbsp;
          <Link href="/auth/sign-in" size="sm">
            Entrar
          </Link>
        </p>
      </div>
    );
  };

  const canResend = countdown <= 0;
  const isResendDisabled = !canResend || isLoading;

  const handleResendPasswordRecovery = () => {
    if (!canResend || isLoading) return;
    requestPasswordChange({ email: getValues("email") })
      .unwrap()
      .then(() => {
        setCountdown(COOLDOWN_RESEND_SECONDS);
      });
  };

  const ContentSuccessRequestPassword = () => {
    return (
      <div
        className="flex flex-col gap-6 h-full justify-center min-h-0"
        style={{ contain: "layout" }}
      >
        <div className="flex flex-col items-center gap-2 pb-2 text-center shrink-0">
          <div className="flex items-center gap-2 p-2 bg-content2 text-default-500  font-bold  justify-center rounded-full text-[10px]">
            <Icon icon="solar:check-circle-bold-duotone" className="text-success" width={48} />
          </div>
          <p className="text-xl font-medium">Link de recuperação enviado</p>
          <p className="text-small text-default-500">
            Verifique seu e-mail para redefinir sua senha.
          </p>
        </div>
        <ul className="flex flex-col gap-2 text-default-500 text-small shrink-0">
          <li className="flex items-center gap-2">
            <Icon icon="solar:info-circle-bold" className="flex-shrink-0" width={24} />
            <p>O link de recuperação expira em 1 hora após o envio.</p>
          </li>
          <li className="flex items-center gap-2">
            <Icon icon="solar:info-circle-bold" className="flex-shrink-0" width={24} />
            <p>O link de recuperação pode ser usado uma única vez após o envio.</p>
          </li>
          <li className="flex items-center gap-2">
            <Icon icon="solar:info-circle-bold" className="flex-shrink-0" width={24} />
            <p>Verifique sua caixa de entrada ou spam para o e-mail de recuperação.</p>
          </li>
        </ul>
        <div className="flex flex-col gap-2 shrink-0 min-h-[5.5rem]">
          <Button
            color="primary"
            onPress={handleResendPasswordRecovery}
            isDisabled={isResendDisabled}
            isLoading={isLoading}
            className="h-11 whitespace-nowrap"
          >
            {!canResend ? (
              <>
                Aguarde{" "}
                <span
                  ref={countdownSpanRef}
                  className="tabular-nums inline-block min-w-[4ch] text-center"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {formatCountdown(countdown)}
                </span>{" "}
                para solicitar novamente
              </>
            ) : (
              "Solicitar novo link"
            )}
          </Button>
          <Link href="/auth/sign-in">
            <Button variant="light" color="primary" className="w-full">
              Voltar para o login
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  const Content = isSuccess ? <ContentSuccessRequestPassword /> : <ContentRequestPassword />;

  return <CardAuth>{Content}</CardAuth>;
};
