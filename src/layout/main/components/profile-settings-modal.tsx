"use client";

import { useSession } from "@/providers/session-provider";
import { useUpdateAvatarUserMutation, useUpdateUserProfileMutation } from "@/services/user.service";
import {
  Avatar,
  Button,
  Chip,
  cn,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaUser, TSchemaUserInput, TSchemaUserOutput } from "./schema-user";
import { Field } from "@/components/field/field";
import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";
import { maskBrazilianPhoneInput } from "@/utils/formatPhone";

export type ProfileSettingsModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ProfileSettingsModal = ({ isOpen, onOpenChange }: ProfileSettingsModalProps) => {
  const { user } = useSession();
  const [updateUserProfile, { isLoading: isUpdatingUser }] = useUpdateUserProfileMutation();
  const [updateImageUser, { isLoading: isUpdatingImage }] = useUpdateAvatarUserMutation();

  const { control, handleSubmit, reset } = useForm<TSchemaUserInput, unknown, TSchemaUserOutput>({
    resolver: zodResolver(schemaUser),
  });

  useEffect(() => {
    if (!isOpen || !user) return;

    let phoneValue = "";
    if (user.phone) {
      try {
        const phoneData = typeof user.phone === "string" ? JSON.parse(user.phone) : user.phone;

        if (phoneData?.ddd && phoneData?.number) {
          phoneValue = `${phoneData.ddd}${phoneData.number}`;
        }
      } catch {
        if (user.phone?.ddd && user.phone?.number) {
          phoneValue = `${user.phone.ddd}${user.phone.number}`;
        }
      }
    }

    reset({
      name: user.name || "",
      phone: phoneValue ? maskBrazilianPhoneInput(phoneValue) : "",
    });
  }, [isOpen, user, reset]);

  const handleUpdateImage = (image: File) => {
    if (!user?.id) return;
    updateImageUser({ id: user.id, image }).unwrap();
  };

  const onSubmit = (data: TSchemaUserOutput) => {
    if (!user?.id) return;
    updateUserProfile({
      id: user.id,
      name: data.name,
      phone: data.phone,
    }).unwrap();
  };

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      placement="center"
      classNames={{ backdrop: "z-[100]", wrapper: "z-[100]" }}
    >
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader className="flex flex-col gap-1 border-b border-default-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Icon icon="solar:settings-linear" className="text-primary text-2xl" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h2 className="text-lg font-bold text-foreground leading-tight">
                Configurações de perfil
              </h2>
              <p className="text-sm text-default-500 font-medium">
                Suas informações pessoais e de contato
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="gap-6 py-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl bg-content2/50 p-4 border border-default-100/80">
            <DropzoneWrapper
              acceptedTypes={FileTypes.IMAGE}
              maxFileSize={5 * 1024 * 1024}
              maxFiles={1}
              onUploadSuccess={(files) => {
                if (files.length > 0) handleUpdateImage(files[0]);
              }}
              onError={() => {}}
            >
              {({ isDragAccept, isDragReject }) => (
                <div
                  className={cn("group relative cursor-pointer rounded-full transition-opacity", {
                    "ring-success ring-2 ring-offset-2 ring-offset-content1": isDragAccept,
                    "ring-danger ring-2 ring-offset-2 ring-offset-content1": isDragReject,
                  })}
                >
                  {!isUpdatingImage ? (
                    <>
                      <Avatar className="h-20 w-20" src={user?.avatar?.url ?? ""} showFallback />
                      <div className="pointer-events-none absolute inset-0 flex h-20 w-20 items-center justify-center rounded-full bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                        <Icon className="h-6 w-6 text-white" icon="solar:camera-linear" />
                      </div>
                    </>
                  ) : (
                    <div className="bg-default-300 flex h-20 w-20 items-center justify-center rounded-full">
                      <Spinner className="text-default-500 h-10 w-10" />
                    </div>
                  )}
                </div>
              )}
            </DropzoneWrapper>
            <div className="flex flex-col gap-0.5 text-center sm:text-left min-w-0">
              <p className="text-lg font-semibold truncate">{user?.name}</p>
              <p className="text-sm text-default-500 truncate">{user?.email}</p>
              <Chip color="primary" size="sm" variant="flat">{user?.platformRole}</Chip>
            </div>
          </div>

          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    {...field}
                    errorMessage={error?.message}
                    isInvalid={!!error?.message}
                    label="Nome completo"
                    labelPlacement="outside"
                    placeholder="Digite seu nome completo"
                    type="text"
                    className="sm:col-span-1"
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value ?? ""}
                    onValueChange={(v) => field.onChange(maskBrazilianPhoneInput(v))}
                    errorMessage={error?.message}
                    isInvalid={!!error?.message}
                    label="Celular"
                    labelPlacement="outside"
                    placeholder="(00) 00000-0000"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                  />
                )}
              />

              <Input
                label="Email"
                labelPlacement="outside"
                value={user?.email}
                isDisabled
                className="sm:col-span-2"
              />
            </div>
          </section>
        </ModalBody>

        <ModalFooter className="border-t border-default-100 gap-2">
          <Button variant="light" onPress={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button color="primary" type="submit" isLoading={isUpdatingUser}>
            Salvar alterações
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
