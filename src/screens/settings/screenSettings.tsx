"use client";

import { useSession } from "@/providers/session-provider";
import { useUpdateUserImageMutation, useUpdateUserMutation } from "@/services/user.service";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  cn,
  Divider,
  Input,
  Select,
  SelectItem,
  Spinner,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaUser, TSchemaUserInput, TSchemaUserOutput } from "./schema-user";
import { Field } from "@/components/field/field";
import { useGetSubscriptionsQuery } from "@/services/subscription/subscription.service";
import { useGetPlansQuery } from "@/services/plan/plan.service";
import { DropzoneWrapper, FileTypes } from "@/components/dropzone-wrapper/dropzone-wrapper";

export const ScreenSettings = () => {
  const [selected, setSelected] = useState("account");
  const [viewInvoices, setViewInvoices] = useState(false);
  const { user } = useSession();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const { data: subscriptions } = useGetSubscriptionsQuery({});
  const { data: plansData } = useGetPlansQuery({ pageSize: 999 });

  const { control, handleSubmit, reset } = useForm<TSchemaUserInput, any, TSchemaUserOutput>({
    resolver: zodResolver(schemaUser),
  });
  const [updateImageUser, { isLoading: isUpdatingImage }] = useUpdateUserImageMutation();

  useEffect(() => {
    if (user) {
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
        phone: phoneValue,
        document: user.document || "",
        documentType: user.documentType || undefined,
        street: user.street || "",
        number: user.number || "",
        complement: user.complement || "",
        district: user.district || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        zip: user.zip || "",
        visibility: user.visibility || undefined,
        rankingName: user.rankingName || "",
      });
    }
  }, [user, reset]);

  const handleUpdateImage = (image: File) => {
    updateImageUser({
      image,
    }).unwrap();
  };

  const onSubmit = (data: TSchemaUserOutput) => {
    updateUser(data).unwrap();
  };

  return (
    <div className="flex flex-col gap-6 ">
      <header className="gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Configurações de perfil</h1>
        <p className="text-sm text-default-500">Gerencie suas informações pessoais e de contato.</p>
      </header>
      <div className="gap-4">
        {selected === "account" && (
          <div className="flex gap-4">
            <Card className="w-full">
              <CardHeader className="flex flex-col md:flex-row items-center gap-5 p-8 bg-content3/50">
                <DropzoneWrapper
                  acceptedTypes={FileTypes.IMAGE}
                  maxFileSize={5 * 1024 * 1024}
                  maxFiles={1}
                  onUploadSuccess={(files) => {
                    if (files.length > 0) {
                      handleUpdateImage(files[0]);
                    }
                  }}
                  onError={() => {}}
                >
                  {({ isDragAccept, isDragReject }) => (
                    <div
                      className={cn(
                        "group relative cursor-pointer rounded-full transition-opacity hover:opacity-100",
                        {
                          "ring-success ring-2 ring-offset-2": isDragAccept,
                          "ring-danger ring-2 ring-offset-2": isDragReject,
                        },
                      )}
                    >
                      {!isUpdatingImage ? (
                        <>
                          <Avatar
                            className="h-20 w-20 opacity-100 transition-opacity group-hover:opacity-70"
                            src={user?.avatar?.url ?? ""}
                            showFallback
                          />

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
                <div className="flex flex-col gap-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold tracking-tight">{user?.name}</h1>
                  <p className="text-medium text-default-500">{user?.email}</p>
                </div>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardBody className="px-8 py-8 gap-10">
                  <section>
                    <div className="flex items-center gap-2 mb-6 border-b-1 border-divider pb-2">
                      <h2 className="text-lg font-semibold">Informações Pessoais</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <Controller
                        control={control}
                        name="name"
                        render={({ field, fieldState: { error } }) => (
                          <Field
                            {...field}
                            errorMessage={error?.message}
                            isInvalid={!!error?.message}
                            label="Nome Completo"
                            labelPlacement="outside"
                            placeholder="Digite seu nome completo"
                            type="text"
                            className="md:col-span-2"
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name="phone"
                        render={({ field, fieldState: { error } }) => (
                          <Field
                            {...field}
                            errorMessage={error?.message}
                            isInvalid={!!error?.message}
                            label="Celular"
                            labelPlacement="outside"
                            placeholder="(00) 00000-0000"
                            type="tel"
                            className="md:col-span-2"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="documentType"
                        render={({ field, fieldState: { error } }) => (
                          <Select
                            {...field}
                            errorMessage={error?.message}
                            isInvalid={!!error?.message}
                            label="Tipo de Doc."
                            labelPlacement="outside"
                            selectedKeys={field.value ? [field.value] : []}
                            onSelectionChange={(keys) => {
                              const selectedKey = Array.from(keys)[0] as string;
                              field.onChange(selectedKey || undefined);
                            }}
                          >
                            <SelectItem key="CPF">CPF</SelectItem>
                            <SelectItem key="CNPJ">CNPJ</SelectItem>
                          </Select>
                        )}
                      />
                      <Controller
                        control={control}
                        name="document"
                        render={({ field, fieldState: { error } }) => (
                          <Field
                            {...field}
                            errorMessage={error?.message}
                            isInvalid={!!error?.message}
                            label="Número do Documento"
                            placeholder="000.000.000-00"
                            labelPlacement="outside"
                          />
                        )}
                      />
                      <Input
                        label="Email"
                        labelPlacement="outside"
                        value={user?.email}
                        isDisabled={true}
                        className="md:col-span-2"
                      />
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-6 border-b-1 border-divider pb-2">
                      <h2 className="text-lg font-semibold">Endereço</h2>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                      <Controller
                        control={control}
                        name="zip"
                        render={({ field, fieldState: { error } }) => (
                          <Field
                            {...field}
                            errorMessage={error?.message}
                            isInvalid={!!error?.message}
                            label="CEP"
                            placeholder="00000-000"
                            labelPlacement="outside"
                            className="md:col-span-2"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="country"
                        render={({ field, fieldState: { error } }) => (
                          <Field
                            {...field}
                            errorMessage={error?.message}
                            isInvalid={!!error?.message}
                            label="País"
                            placeholder="Brasil"
                            labelPlacement="outside"
                            className="md:col-span-2"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="state"
                        render={({ field, fieldState: { error } }) => (
                          <Field
                            {...field}
                            errorMessage={error?.message}
                            isInvalid={!!error?.message}
                            label="Estado"
                            placeholder="UF"
                            labelPlacement="outside"
                            className="md:col-span-2"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="city"
                        render={({ field, fieldState: { error } }) => (
                          <Field
                            {...field}
                            errorMessage={error?.message}
                            isInvalid={!!error?.message}
                            label="Cidade"
                            placeholder="Cidade"
                            labelPlacement="outside"
                            className="md:col-span-2"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="district"
                        render={({ field, fieldState: { error } }) => (
                          <Field
                            {...field}
                            errorMessage={error?.message}
                            isInvalid={!!error?.message}
                            label="Rua"
                            placeholder="Nome da rua"
                            labelPlacement="outside"
                            className="md:col-span-4"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="number"
                        render={({ field, fieldState: { error } }) => (
                          <Field
                            {...field}
                            errorMessage={error?.message}
                            isInvalid={!!error?.message}
                            label="Número"
                            placeholder="123"
                            labelPlacement="outside"
                            className="md:col-span-2"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="complement"
                        render={({ field, fieldState: { error } }) => (
                          <Field
                            {...field}
                            errorMessage={error?.message}
                            isInvalid={!!error?.message}
                            label="Comp."
                            placeholder="Apto"
                            labelPlacement="outside"
                            className="md:col-span-2"
                          />
                        )}
                      />
                    </div>
                  </section>
                  <section>
                    <div className="flex items-center gap-2 mb-6 border-b-1 border-divider pb-2">
                      <h2 className="text-lg font-semibold">Ranking</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <Controller
                        control={control}
                        name="rankingName"
                        render={({ field, fieldState: { error } }) => (
                          <Field
                            {...field}
                            errorMessage={error?.message}
                            isInvalid={!!error?.message}
                            label="Nome do Ranking"
                            placeholder="Nome do Ranking"
                            labelPlacement="outside"
                            className="md:col-span-2"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="visibility"
                        render={({ field, fieldState: { error } }) => (
                          <Select
                            errorMessage={error?.message}
                            isInvalid={!!error?.message}
                            label="Visibilidade"
                            labelPlacement="outside"
                            selectedKeys={field.value ? [field.value] : []}
                            onSelectionChange={(keys) => {
                              const selectedKey = Array.from(keys)[0] as string;
                              field.onChange(selectedKey || undefined);
                            }}
                            className="md:col-span-2"
                          >
                            <SelectItem key="PUBLIC">Público</SelectItem>
                            <SelectItem key="PRIVATE">Privado</SelectItem>
                          </Select>
                        )}
                      />
                    </div>
                  </section>

                  <div className="flex justify-end gap-3 pt-4 border-t-1 border-divider">
                    <Button variant="light" color="default" onClick={() => reset()}>
                      Cancelar
                    </Button>
                    <Button color="primary" type="submit" isLoading={isUpdatingUser}>
                      Salvar Alterações
                    </Button>
                  </div>
                </CardBody>
              </form>
            </Card>
            <div className="flex flex-col gap-4">
              <Tabs
                fullWidth
                aria-label="Opções de configuração"
                selectedKey={selected}
                onSelectionChange={(key) => setSelected(key as string)}
              >
                <Tab key="account" title="Perfil" />
                <Tab key="Planos e Cobranças" title="Planos e Cobranças" />
              </Tabs>
              <Card className="shadow-sm h-fit border-none bg-content1 p-4">
                <CardBody className="flex flex-col gap-3">
                  <div>
                    <p className="text-lg font-bold tracking-tight">Notificações Push</p>
                    <p className="text-sm text-default-500 mt-2">
                      Gerencie suas preferências de notificações push para receber atualizações
                      importantes do sistema.
                    </p>
                  </div>
                  <Divider className="my-2" />
                  <Button color="primary" radius="full" startContent={<Icon icon="mdi:bell" />}>
                    Ativar notificações
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
        {selected === "Planos e Cobranças" && (
          <div className="flex gap-4">
            <Card className="w-full">
              <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 p-8 bg-gradient-to-r from-primary-500/10 to-secondary-500/10">
                <div className="flex gap-4 items-center">
                  <div className="p-3 rounded-full bg-primary/20 text-primary">
                    <Icon icon="solar:wallet-bold-duotone" width={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold tracking-tight">
                        {user?.subscription?.plan?.title}
                      </h1>
                      <Chip color="primary" variant="flat" size="sm">
                        {user?.subscription?.status === "ACTIVE" ? "Ativo" : "Inativo"}
                      </Chip>
                    </div>
                    <p className="text-default-500 text-sm">
                      Seu plano renova dia{" "}
                      {user?.subscription?.endDate &&
                        dayjs(user.subscription.endDate).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">
                    {formatCurrency(user?.subscription?.plan?.price ?? 0)}
                    <span className="text-sm text-default-400 font-normal">/mês</span>
                  </p>
                </div>
              </CardHeader>

              <Divider />

              <CardBody className="p-8 gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-end h-8">
                      <h3 className="font-semibold text-lg">Último Pagamento</h3>
                    </div>

                    <div className="bg-content2/50 border border-divider p-5 rounded-2xl flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-success-500/10 text-success">
                            <Icon icon="solar:check-circle-bold-duotone" width={24} />
                          </div>
                          <div>
                            <p className="text-sm font-bold">Pagamento Confirmado</p>
                            <p className="text-xs text-default-500">
                              {user?.subscription?.createdAt &&
                                dayjs(user.subscription.createdAt).format("DD/MM/YYYY")}
                            </p>
                          </div>
                        </div>
                        <Chip size="sm" variant="flat" color="success" className="font-medium">
                          {user?.subscription?.status === "ACTIVE" ? "Ativo" : "Inativo"}
                        </Chip>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-divider/50">
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-default-500">Valor total</span>
                          <span className="font-bold text-default-700">
                            {formatCurrency(user?.subscription?.plan?.price ?? 0)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm items-center">
                          <span className="text-default-500 ">ID da Transação</span>
                          <span className="font-mono text-[10px] uppercase tracking-wider text-default-400">
                            #{user?.subscription?.externalId || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-end h-8">
                      <p className="font-semibold text-lg ">Método de Pagamento</p>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        className="text-xs h-8 min-w-unit-0 px-2"
                        startContent={<Icon icon="solar:pen-bold" width={14} />}
                      >
                        Alterar
                      </Button>
                    </div>

                    <div className="bg-content2/50 border border-divider p-5 rounded-2xl flex-1 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-content1 border border-divider p-2 rounded-xl shadow-sm">
                            <Icon icon="logos:visa" width={30} />
                          </div>
                          <div>
                            <p className="text-sm font-bold">Visa •••• 4242</p>
                            <p className="text-xs text-default-500">
                              Expira em{" "}
                              {(user?.subscription?.expiredAt &&
                                dayjs(user.subscription.expiredAt).format("DD/MM/YYYY")) ||
                                "N/A"}
                            </p>
                          </div>
                        </div>
                        <Chip size="sm" variant="flat" color="success">
                          {user?.subscription?.plan?.recurrence === "MONTHLY" ? "Mensal" : "Anual"}
                        </Chip>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-divider/50">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-default-500 flex items-center gap-2">
                            Próxima fatura
                          </span>
                          <span className="font-semibold text-default-700">
                            {user?.subscription?.nextPayment?.paidAt &&
                              dayjs(user.subscription.nextPayment.paidAt).format("DD MMM, YYYY")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-default-500">Valor estimado</span>
                          <span className="text-primary font-bold">
                            {formatCurrency(user?.subscription?.plan?.price ?? 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  {!viewInvoices ? (
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Mude seu plano</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(plansData?.data ?? []).map((plan) => {
                          const isCurrentPlan = plan.id === user?.subscription?.plan?.id;
                          const isHighlight = plan.isHighlight || isCurrentPlan;
                          return (
                            <div
                              key={plan.id}
                              className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                                isHighlight
                                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.02]"
                                  : "border-divider hover:border-default-400 bg-content1"
                              }`}
                            >
                              {isCurrentPlan && (
                                <Chip
                                  color="primary"
                                  size="sm"
                                  className="absolute -top-3 left-1/2 -translate-x-1/2 font-semibold"
                                >
                                  Plano Atual
                                </Chip>
                              )}

                              <div>
                                <div className="flex justify-between items-start mb-1">
                                  <p className="font-bold text-xl">{plan.title}</p>
                                </div>
                                <p className="text-xs text-default-500 mb-4">{plan.description}</p>

                                <div className="mb-6">
                                  {plan.isFree ? (
                                    <p className="text-3xl font-bold">Grátis</p>
                                  ) : plan.price > 0 ? (
                                    <p className="text-3xl font-bold">
                                      {formatCurrency(plan.price)}
                                      <span className="text-sm text-default-400 font-normal">
                                        /mês
                                      </span>
                                    </p>
                                  ) : (
                                    <p className="text-xl font-bold pt-2">Sob consulta</p>
                                  )}
                                </div>

                                <Divider className="mb-4 opacity-50" />

                                <ul className="space-y-3 mb-6">
                                  {plan.features.map((feature, i) => (
                                    <li
                                      key={i}
                                      className="flex items-center gap-2 text-sm text-default-600"
                                    >
                                      <Icon
                                        icon="solar:check-read-linear"
                                        width={18}
                                        className={
                                          isHighlight ? "text-primary" : "text-default-400"
                                        }
                                      />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <Button
                                fullWidth
                                variant={isCurrentPlan ? "flat" : "solid"}
                                color={isCurrentPlan ? "primary" : "default"}
                                isDisabled={isCurrentPlan}
                                className="font-semibold"
                              >
                                {isCurrentPlan ? "Ativo Atualmente" : "Selecionar Plano"}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <section className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg mb-2">Histórico de Faturas</h3>
                      </div>

                      <Table aria-label="Tabela de faturas" removeWrapper>
                        <TableHeader>
                          <TableColumn>PLANO</TableColumn>
                          <TableColumn>MÉTODO</TableColumn>
                          <TableColumn>STATUS</TableColumn>
                          <TableColumn align="end">VALOR</TableColumn>
                          <TableColumn align="end">PARCELA</TableColumn>
                          <TableColumn align="end">DATA</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="Nenhuma fatura encontrada">
                          {(subscriptions?.data ?? []).map((subscription) => (
                            <TableRow key={subscription.id}>
                              <TableCell className="text-sm text-default-500">
                                {subscription.planName ?? "-"}
                              </TableCell>

                              <TableCell className="text-sm text-default-500">
                                {subscription.paymentMethod}
                              </TableCell>

                              <TableCell>
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  color={
                                    subscription.status === "PAID"
                                      ? "success"
                                      : subscription.status === "REFUNDED"
                                        ? "danger"
                                        : "warning"
                                  }
                                >
                                  {
                                    {
                                      PAID: "Pago",
                                      CHARGEBACK: "Estorno",
                                      REFUNDED: "Reembolsado",
                                    }[subscription.status]
                                  }
                                </Chip>
                              </TableCell>

                              <TableCell>{formatCurrency(subscription.value)}</TableCell>

                              <TableCell className="text-sm text-default-500">
                                {subscription.installments}
                              </TableCell>

                              <TableCell className="text-sm">
                                {subscription.paidAt
                                  ? dayjs(subscription.paidAt).format("DD/MM/YYYY")
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </section>
                  )}
                </div>

                <div className="flex gap-3 justify-end">
                  <Button color="default">Cancelar assinatura</Button>
                  <Button
                    color="primary"
                    startContent={
                      <Icon
                        icon={viewInvoices ? "solar:card-2-linear" : "solar:bill-list-linear"}
                        width={18}
                      />
                    }
                    onClick={() => setViewInvoices(!viewInvoices)}
                  >
                    {viewInvoices ? "Ver Planos Disponíveis" : "Ver Histórico de Faturas"}
                  </Button>
                </div>
              </CardBody>
            </Card>
            <div className="flex flex-col gap-4">
              <Tabs
                fullWidth
                aria-label="Opções de configuração"
                selectedKey={selected}
                onSelectionChange={(key) => setSelected(key as string)}
              >
                <Tab key="account" title="Perfil" />
                <Tab key="Planos e Cobranças" title="Planos e Cobranças" />
              </Tabs>
              <Card className="shadow-sm h-fit border-none bg-content1 p-4">
                <CardBody className="flex flex-col gap-3">
                  <div>
                    <p className="text-lg font-bold tracking-tight">Notificações Push</p>
                    <p className="text-sm text-default-500 mt-2">
                      Gerencie suas preferências de notificações push para receber atualizações
                      importantes do sistema.
                    </p>
                  </div>
                  <Divider className="my-2" />
                  <Button color="primary" radius="full" startContent={<Icon icon="mdi:bell" />}>
                    Ativar notificações
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
