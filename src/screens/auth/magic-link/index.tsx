"use client";

import { Button, Spinner } from "@heroui/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { useAuthLoginEmailQuery } from "@/services/user.service";
import { CardAuth } from "@/components/card-auth";
import { Icon } from "@iconify/react";
import { FormPassword } from "./form-password";
import { useDispatch } from "react-redux";
import { setSession } from "@/features/session.slice";
import { IUser } from "@/types/user.type";

export const ScreenMagicLink = () => {
  const { replace } = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { isError, isLoading, data } = useAuthLoginEmailQuery(
    { id: id as string, type: "FIRST_LOGIN" },
    { skip: !id },
  );

  const handleSuccessPassword = () => {
    dispatch(setSession({ user: data?.user as IUser, token: data?.token as string }));
    replace("/spy");
  };

  const actions = {
    CREATE_PASSWORD: (
      <div className="flex flex-col gap-6 items-center justify-center h-full">
        <div className="relative flex items-center justify-center p-4 bg-content2/80 w-fit mx-auto rounded-full  flex-col">
          <Icon icon="solar:shield-check-bold" className="text-default-500" width={64} />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-2xl font-bold">Crie sua senha</h2>
          <h3 className="text-default-500 text-small">
            Para finalizar a ativação de conta, digite uma senha.
          </h3>
        </div>
        <FormPassword
          temporaryToken={data?.temporaryToken as string}
          onSuccess={handleSuccessPassword}
        />
      </div>
    ),
  };

  return (
    <CardAuth>
      {isLoading ? (
        <>
          <Spinner />
        </>
      ) : isError ? (
        <div className="items-center justify-center gap-4 p-8">
          <div className="relative flex h-60 w-full flex-col">
            <Image fill alt="" src={"/next.svg"} />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <h2 className="subtitle-md font-bold">Link não encontrado ou invalido.</h2>
            <h3 className="body-md">
              Por favor verifique o link no email. e atualize a pagina se o error persistir contate
              o suporte.
            </h3>
          </div>
          <Button fullWidth color="primary" onPress={() => window.location.reload()}>
            Atualizar pagina
          </Button>
        </div>
      ) : data?.action ? (
        actions[data.action as keyof typeof actions]
      ) : (
        <div className="flex flex-col gap-6 items-center justify-center h-full">
          <div className="relative flex items-center justify-center p-4 bg-content2/60 w-fit mx-auto rounded-full  flex-col">
            <Icon icon="solar:check-circle-bold-duotone" className="text-success" width={64} />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <h2 className="subtitle-md font-bold">Parabéns, conta validada com sucesso!</h2>
            <h3 className="body-md">Para finalizar a ativação de conta, clique no botão abaixo.</h3>
          </div>
          <Button
            fullWidth
            className="bg-linear-to-r from-primary to-primary-300/40"
            onPress={() => replace("/spy")}
          >
            Acessa plataforma
          </Button>
        </div>
      )}
    </CardAuth>
  );
};
