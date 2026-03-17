"use client";

import { useEffect } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuthLoginSsoMutation } from "@/services/user.service";

export default function SsoPage() {
  const searchParams = useSearchParams();
  const appId = searchParams.get("appId");
  const router = useRouter();

  const ssoToken = searchParams.get("token");
  const [loginSso, { isError }] = useAuthLoginSsoMutation();

  useEffect(() => {
    if (ssoToken) {
      loginSso({ ssoToken: ssoToken });
    }
  }, [loginSso, ssoToken]);

  if (!ssoToken || isError) {
    return (
      <Card
        isBlurred
        className="rounded-large bg-background/60 shadow-small dark:bg-default-100/50 mx-auto flex w-full max-w-xl flex-col gap-4 backdrop-blur-md backdrop-saturate-150"
      >
        <CardBody className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <Icon icon="solar:shield-warning-bold-duotone" width="48" />
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <p className="text-lg font-semibold">Erro ao realizar login</p>
            <p className="text-default-500 text-sm">
              Token de login não encontrado, para continuar, clique no botão abaixo para ser
              redirecionado para a página de login.
            </p>
          </div>
          <Button
            className="min-w-fit"
            color="primary"
            onPress={() =>
              router.push(`${process.env.NEXT_PUBLIC_SSO_URL}/auth/sign-app?appId=${appId}`)
            }
          >
            Ir para login
          </Button>
        </CardBody>
      </Card>
    );
  }

  return null;
}
