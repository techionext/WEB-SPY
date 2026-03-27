"use client";

import { SwitchForm } from "@/components/switch-forms/switch-forms";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { useGetSpyOffersQuery } from "@/services/spy/spy-offers.service";
import { useGetLabsPagesQuery } from "@/services/labs/page/labs-page.service";
import { usePostAnalysisRequestMutation } from "@/services/analysis-request/analysis-request.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  schemaCreateSolicitation,
  TSchemaCreateSolicitationInput,
  TSchemaCreateSolicitationOutput,
} from "./schema-create-solicitation";
import { useGetUserInsiderQuery } from "@/services/user.service";

const USER_INSIDER_AUTO_KEY = "__auto__";

const FORM_DEFAULTS: TSchemaCreateSolicitationInput = {
  title: "",
  libraryUrl: "",
  type: "SIMPLE",
  observation: "",
  offerId: "",
  userInsiderId: "",
};

export type ModalAddProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
  trigger?: ReactNode;
};

export const ModalAdd = ({
  isOpen: controlledIsOpen,
  onOpenChange,
  showTrigger = true,
  trigger,
}: ModalAddProps) => {
  const [postAnalysisRequest, { isLoading: isPostingAnalysisRequest }] =
    usePostAnalysisRequestMutation();
  const disclosure = useDisclosure();
  const isOpen = controlledIsOpen ?? disclosure.isOpen;
  const { data: usersData, isLoading: isLoadingUsers } = useGetUserInsiderQuery({
    page: 1,
    pageSize: 100,
    role: "INSIDER",
  });
  const { control, reset, handleSubmit } = useForm<TSchemaCreateSolicitationInput>({
    resolver: zodResolver(schemaCreateSolicitation),
    defaultValues: FORM_DEFAULTS,
  });

  const [linkOffer, setLinkOffer] = useState(false);
  const [filterOffer, setFilterOffer] = useState("");
  const [offerId, setOfferId] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    reset({ ...FORM_DEFAULTS });
    setLinkOffer(false);
    setFilterOffer("");
    setOfferId("");
  }, [isOpen, reset]);

  const { data: offersData, isLoading: isLoadingOffers } = useGetSpyOffersQuery(
    { filter: filterOffer, pageSize: 50 },
    { skip: !isOpen || !linkOffer },
  );
  const { data: pagesData, isLoading: isLoadingPages } = useGetLabsPagesQuery(
    { offerId, pageSize: 100 },
    { skip: !isOpen || !linkOffer || !offerId },
  );

  const open = () => {
    if (onOpenChange) onOpenChange(true);
    else disclosure.onOpen();
  };

  const close = () => {
    if (onOpenChange) onOpenChange(false);
    else disclosure.onClose();
  };

  const onSubmit = (data: TSchemaCreateSolicitationOutput) => {
    const { userInsiderId, ...rest } = data;
    postAnalysisRequest({
      ...rest,
      title: data.title?.trim() || "Solicitação de análise",
      ...(userInsiderId?.trim() ? { userInsiderId: userInsiderId.trim() } : {}),
    })
      .unwrap()
      .then(() => {
        close();
        reset({ ...FORM_DEFAULTS });
      });
  };

  return (
    <Fragment>
      {showTrigger ? (
        <Button
          startContent={<Icon width={20} icon="solar:add-circle-bold" />}
          color="primary"
          onPress={open}
        >
          {trigger ?? "Nova solicitação"}
        </Button>
      ) : null}

      <Modal size="xl" isOpen={isOpen} onClose={close} scrollBehavior="inside">
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader className="flex items-center gap-4 py-6 border-b border-default-100/50">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border-1 border-primary/20">
              <Icon icon="solar:add-circle-linear" className="text-primary text-2xl" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-white leading-tight">
                Nova solicitação de análise
              </h2>
              <p className="text-sm text-default-400 font-medium">
                Preencha os dados para solicitar uma análise
              </p>
            </div>
          </ModalHeader>

          <ModalBody className="gap-6 pt-6 pb-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="text"
                      placeholder="Digite o título da solicitação"
                      label={
                        <div className="flex items-center gap-2 text-default-400">
                          <Icon icon="solar:text-field-linear" width={16} />
                          <span className="text-xs font-bold tracking-widest uppercase">
                            Título
                          </span>
                        </div>
                      }
                      labelPlacement="outside"
                      radius="md"
                      variant="flat"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      label={
                        <div className="flex items-center gap-2 text-default-400">
                          <Icon icon="solar:document-text-linear" width={16} />
                          <span className="text-xs font-bold tracking-widest uppercase">
                            Tipo de análise
                          </span>
                        </div>
                      }
                      placeholder="Selecione o tipo de análise"
                      labelPlacement="outside"
                      radius="md"
                      variant="flat"
                      selectedKeys={field.value ? new Set([field.value]) : new Set()}
                      onSelectionChange={(keys) => {
                        if (keys === "all") return;
                        const selected = [...keys][0] as "SIMPLE" | "ADVANCED" | undefined;
                        field.onChange(selected ?? "SIMPLE");
                      }}
                    >
                      <SelectItem key="SIMPLE" textValue="Simples">
                        Simples
                      </SelectItem>
                      <SelectItem key="ADVANCED" textValue="Avançada">
                        Avançada
                      </SelectItem>
                    </Select>
                  )}
                />

                <SwitchForm
                  label="Vincular a uma oferta"
                  description="Opcional — associe uma oferta existente"
                  isSelected={linkOffer}
                  onValueChange={(v) => {
                    setLinkOffer(v);
                    if (!v) {
                      setOfferId("");
                    }
                  }}
                />

                {linkOffer ? (
                  <Controller
                    control={control}
                    name="offerId"
                    render={({ field }) => (
                      <Autocomplete
                        label={
                          <div className="flex items-center gap-2 text-default-400">
                            <Icon icon="solar:tag-linear" width={16} />
                            <span className="text-xs font-bold tracking-widest uppercase">
                              Oferta
                            </span>
                          </div>
                        }
                        labelPlacement="outside"
                        placeholder="Selecione uma oferta"
                        defaultItems={offersData?.data ?? []}
                        isLoading={isLoadingOffers}
                        onInputChange={setFilterOffer}
                        selectedKey={field.value || offerId || undefined}
                        onSelectionChange={(key) => {
                          const selectedId = (key as string) ?? "";
                          setOfferId(selectedId);
                          field.onChange(selectedId);
                        }}
                      >
                        {(item) => (
                          <AutocompleteItem key={item.id} textValue={item.title}>
                            <div className="flex items-center gap-2">
                              {item.image?.url ? (
                                <Image
                                  src={item.image.url}
                                  alt={item.title}
                                  className="w-6 h-6 rounded-md object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-md bg-content3 flex items-center justify-center">
                                  <Icon icon="solar:gallery-minimalistic-linear" width={14} />
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{item.title}</span>
                                <span className="text-xs text-default-400">
                                  {item.trafficNetwork}
                                </span>
                              </div>
                            </div>
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  />
                ) : null}
              </div>

              {linkOffer && offerId ? (
                <Controller
                  control={control}
                  name="libraryUrl"
                  render={({ field }) => {
                    const selectedPage = (pagesData?.data ?? []).find(
                      (page) => page.url === field.value,
                    );

                    return (
                      <Autocomplete
                        label={
                          <div className="flex items-center gap-2 text-default-400">
                            <Icon icon="solar:link-linear" width={16} />
                            <span className="text-xs font-bold tracking-widest uppercase">
                              URL da Biblioteca
                            </span>
                          </div>
                        }
                        placeholder="Selecione uma Biblioteca"
                        labelPlacement="outside"
                        defaultItems={pagesData?.data ?? []}
                        isLoading={isLoadingPages}
                        selectedKey={selectedPage?.id}
                        onSelectionChange={(key) => {
                          const selected = (pagesData?.data ?? []).find(
                            (page) => page.id === (key as string | undefined),
                          );
                          field.onChange(selected?.url ?? "");
                        }}
                      >
                        {(page) => (
                          <AutocompleteItem key={page.id} textValue={page.title || page.url}>
                            <div className="flex items-center gap-2">
                              {page.image?.url ? (
                                <Image
                                  src={page.image.url}
                                  alt={page.title || page.url}
                                  className="w-8 h-8 rounded-md object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-md bg-content3 flex items-center justify-center">
                                  <Icon icon="solar:gallery-minimalistic-linear" width={14} />
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="text-sm font-medium truncate max-w-[400px]">
                                  {page.title || page.url}
                                </span>
                                <span className="text-xs text-default-400">{page.type}</span>
                              </div>
                            </div>
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    );
                  }}
                />
              ) : (
                <Controller
                  control={control}
                  name="libraryUrl"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      label={
                        <div className="flex items-center gap-2 text-default-400">
                          <Icon icon="solar:link-linear" width={16} />
                          <span className="text-xs font-bold tracking-widest uppercase">
                            URL da Biblioteca
                          </span>
                        </div>
                      }
                      placeholder="Digite a URL da Biblioteca"
                      labelPlacement="outside"
                      radius="md"
                      variant="flat"
                    />
                  )}
                />
              )}

              <Controller
                control={control}
                name="userInsiderId"
                render={({ field }) => (
                  <Select
                    label={
                      <div className="flex items-center gap-2 text-default-400">
                        <Icon icon="solar:user-linear" width={16} />
                        <span className="text-xs font-bold tracking-widest uppercase">
                          Quem irá analisar a solicitação?
                        </span>
                      </div>
                    }
                    placeholder="Selecione quem irá analisar a solicitação"
                    labelPlacement="outside"
                    radius="md"
                    variant="flat"
                    isLoading={isLoadingUsers}
                    selectedKeys={
                      field.value?.trim()
                        ? new Set([field.value])
                        : new Set([USER_INSIDER_AUTO_KEY])
                    }
                    onSelectionChange={(keys) => {
                      if (keys === "all") return;
                      const selected = [...keys][0] as string | undefined;
                      if (!selected || selected === USER_INSIDER_AUTO_KEY) {
                        field.onChange("");
                        return;
                      }
                      field.onChange(selected);
                    }}
                  >
                    {[
                      {
                        id: USER_INSIDER_AUTO_KEY,
                        label: "Escolher automaticamente",
                      },
                      ...(usersData?.data ?? []).map((user) => ({
                        id: user.id,
                        label: user.name,
                      })),
                    ].map((item) => (
                      <SelectItem key={item.id} textValue={item.label}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="observation"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label={
                      <div className="flex items-center gap-2 text-default-400">
                        <Icon icon="solar:notes-linear" width={16} />
                        <span className="text-xs font-bold tracking-widest uppercase">
                          Descrição
                        </span>
                      </div>
                    }
                    placeholder="Digite as observações da solicitação"
                    labelPlacement="outside"
                    radius="md"
                    variant="flat"
                  />
                )}
              />
            </div>
          </ModalBody>

          <ModalFooter className="border-t border-default-100/50 py-6 gap-3">
            <Button variant="flat" onPress={close} fullWidth>
              Cancelar
            </Button>
            <Button color="primary" type="submit" fullWidth isLoading={isPostingAnalysisRequest}>
              <Icon icon="solar:add-circle-bold" className="text-lg" />
              Solicitar análise
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};
