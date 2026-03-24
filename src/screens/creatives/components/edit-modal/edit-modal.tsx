"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Tabs,
  Tab,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Field } from "@/components/field/field";
import { SwitchForm } from "@/components/switch-forms/switch-forms";
import { ILabsCreative } from "@/types/labs/creative/labs-creative.type";
import { trafficNetworkValues, TrafficNetwork } from "@/types/offer/offer.type";
import { languages } from "@/components/select-language/countries";
import { useUpdateLabsCreativeMutation } from "@/services/creative/creative.service";
import { useGetLabsPagesQuery } from "@/services/labs/page/labs-page.service";
import {
  schemaEditCreative,
  SchemaEditCreativeInput,
  SchemaEditCreativeOutput,
} from "./schema-edit";
import { HistoryTab } from "./history-tab";

interface EditModalProps {
  creative: ILabsCreative;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const EditModal = ({ creative, isOpen, onClose, initialTab = "edit" }: EditModalProps) => {
  const { id: offerId } = useParams<{ id: string }>();
  const [updateCreative, { isLoading }] = useUpdateLabsCreativeMutation();
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const { control, reset, handleSubmit } = useForm<
    SchemaEditCreativeInput,
    any,
    SchemaEditCreativeOutput
  >({
    resolver: zodResolver(schemaEditCreative),
  });

  const trafficNetworkValue = useWatch({ control, name: "trafficNetwork" });
  const { data: pages } = useGetLabsPagesQuery({
    offerId: offerId as string,
  });

  useEffect(() => {
    if (creative && isOpen) {
      reset({
        title: creative.title,
        description: creative.description || "",
        language: creative.language,
        isClimbing: creative.isClimbing,
        trafficNetwork: creative.trafficNetwork,
        salesAngle: creative.salesAngle || "",
        pageId: creative.page?.id || "",
      });
    }
  }, [creative, isOpen, reset, pages]);

  const onSubmit = async (data: SchemaEditCreativeOutput) => {
    await updateCreative({
      id: creative.id,
      offerId: offerId as string,
      ...data,
    })
      .unwrap()
      .then(() => {
        onClose();
      });
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader className="flex items-center gap-4 py-6 border-b border-default-100/50">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border-1 border-primary/20">
            <Icon icon="solar:pen-new-square-linear" className="text-primary text-2xl" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white leading-tight">Editar Criativo</h2>
            <p className="text-sm text-default-400 font-medium">{creative.title}</p>
          </div>
        </ModalHeader>

        <ModalBody className="gap-6 pt-6 pb-8">
          <Tabs
            fullWidth
            size="lg"
            aria-label="Abas de edição"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            classNames={{
              tabList: "bg-content2 p-1 rounded-2xl",
              tabContent: "group-data-[selected=true]:text-white font-semibold text-sm",
            }}
          >
            <Tab
              key="edit"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="solar:pen-bold" />
                  <span>Editar</span>
                </div>
              }
            >
              <div className="flex flex-col gap-6 -mt-2">
                <Controller
                  control={control}
                  name="title"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <div className="relative">
                      <Field
                        {...field}
                        label={
                          <div className="flex items-center gap-2 text-default-400">
                            <Icon icon="solar:document-text-linear" width={16} />
                            <span className="text-xs font-bold tracking-widest uppercase">
                              Título
                            </span>
                          </div>
                        }
                        labelPlacement="outside"
                        placeholder="Digite o título do criativo"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                      />
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="description"
                  render={({ field, fieldState: { invalid, error } }) => (
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
                      labelPlacement="outside"
                      placeholder="Digite a descrição do criativo"
                      isInvalid={invalid}
                      errorMessage={error?.message}
                    />
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={control}
                    name="trafficNetwork"
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Select
                        {...field}
                        label={
                          <div className="flex items-center gap-2 text-default-400">
                            <Icon icon="solar:global-linear" width={16} />
                            <span className="text-xs font-bold tracking-widest uppercase">
                              Rede de tráfego
                            </span>
                          </div>
                        }
                        labelPlacement="outside"
                        placeholder="Selecione a rede de tráfego"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        selectedKeys={[field.value ?? ""]}
                        onSelectionChange={(v) => field.onChange(v.currentKey)}
                      >
                        {(Object.values(TrafficNetwork) as TrafficNetwork[]).map(
                          (trafficNetwork) => (
                            <SelectItem
                              key={trafficNetwork}
                              textValue={trafficNetworkValues[trafficNetwork].label}
                              startContent={
                                <Icon icon={trafficNetworkValues[trafficNetwork].icon} width={16} />
                              }
                            >
                              {trafficNetworkValues[trafficNetwork].label}
                            </SelectItem>
                          ),
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    control={control}
                    name="language"
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Autocomplete
                        label={
                          <div className="flex items-center gap-2 text-default-400">
                            <Icon icon="solar:translation-linear" width={16} />
                            <span className="text-xs font-bold tracking-widest uppercase">
                              Idioma
                            </span>
                          </div>
                        }
                        labelPlacement="outside"
                        placeholder="Selecione o idioma"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        defaultItems={languages}
                        selectedKey={field.value}
                        onSelectionChange={(key) => field.onChange(key)}
                      >
                        {(language) => (
                          <AutocompleteItem
                            key={language.label}
                            textValue={language.label}
                            startContent={
                              <Avatar
                                alt={language.label}
                                className="w-5 h-5"
                                src={language.flag}
                              />
                            }
                          >
                            <span className="text-sm font-medium">{language.label}</span>
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  />
                </div>

                <div className="flex gap-4">
                  <Controller
                    control={control}
                    name="salesAngle"
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Field
                        {...field}
                        label={
                          <div className="flex items-center gap-2 text-default-400">
                            <Icon icon="solar:target-linear" width={16} />
                            <span className="text-xs font-bold tracking-widest uppercase">
                              Ângulo de venda
                            </span>
                          </div>
                        }
                        labelPlacement="outside"
                        placeholder="Digite o ângulo de venda"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                      />
                    )}
                  />

                  {trafficNetworkValue === TrafficNetwork.YOUTUBE && (
                    <Controller
                      control={control}
                      name="pageId"
                      render={({ field, fieldState: { invalid, error } }) => (
                        <Select
                          {...field}
                          label={
                            <div className="flex items-center gap-2 text-default-400">
                              <Icon icon="solar:globus-linear" width={16} />
                              <span className="text-xs font-bold tracking-widest uppercase">
                                Página Relacionada
                              </span>
                            </div>
                          }
                          labelPlacement="outside"
                          placeholder="Selecione a página"
                          isInvalid={invalid}
                          errorMessage={error?.message}
                          selectedKeys={[field.value ?? ""]}
                          onSelectionChange={(v) => field.onChange(v.currentKey)}
                        >
                          {(pages?.data || []).map((page: any) => (
                            <SelectItem key={page.id} textValue={page.title}>
                              {page.title}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                  )}
                </div>

                <Controller
                  control={control}
                  name="isClimbing"
                  render={({ field }) => (
                    <div className="mt-2 group">
                      <SwitchForm
                        label="Em escala?"
                        description="Marcar criativo como em fase de escala"
                        isSelected={field.value}
                        onValueChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>
            </Tab>
            <Tab
              key="history"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="solar:history-bold" />
                  <span>Histórico</span>
                </div>
              }
            >
              <div className="-mt-2">
                <HistoryTab creative={creative} />
              </div>
            </Tab>
          </Tabs>
        </ModalBody>

        <ModalFooter className="border-t border-default-100/50 py-6 gap-3">
          <Button variant="flat" onPress={onClose} fullWidth>
            Cancelar
          </Button>
          <Button color="primary" type="submit" isLoading={isLoading} fullWidth>
            <Icon icon="solar:stars-minimalistic-bold" className="text-lg" />
            Salvar alterações
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
