"use client";

import {
  Avatar,
  Button,
  Chip,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState, type Key } from "react";

export type SolicitationStatus = "pending" | "approved";

export type DrawerEditProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Nome do solicitante exibido no modal de aprovação e no cabeçalho. */
  requesterName?: string;
};

export const DrawerEdit = ({
  isOpen,
  onOpenChange,
  requesterName = "Carlos Mendes",
}: DrawerEditProps) => {
  const [status, setStatus] = useState<SolicitationStatus>("pending");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const handleStatusSelection = (keys: "all" | Set<Key>) => {
    if (keys === "all") return;
    const selected = [...keys][0] as SolicitationStatus | undefined;
    if (!selected) return;
    if (selected === "approved") {
      if (status !== "approved") {
        setIsApproveModalOpen(true);
      }
      return;
    }
    setStatus(selected);
  };

  const handleConfirmApprove = () => {
    setStatus("approved");
    setIsApproveModalOpen(false);
  };

  const handleApproveModalOpenChange = (open: boolean) => {
    setIsApproveModalOpen(open);
  };

  return (
    <>
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="right"
      size="2xl"
      className="p-2"
    >
      <DrawerContent className="w-full">
        <DrawerHeader className="flex flex-col gap-1 ">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold">Método Turbo Slim 3.0</h1>
            <Chip size="sm" radius="md" variant="flat" color="primary">
              Avançado
            </Chip>
          </div>
          <p className="text-sm text-default-400">
            Solicitado por <span className="font-bold text-white">{requesterName}</span> em 24/03/2026
          </p>
        </DrawerHeader>
        <DrawerBody className="py-4 px-6 gap-6">
          <Select
            labelPlacement="outside"
            label="Status"
            placeholder="Selecione o status"
            radius="md"
            variant="flat"
            selectedKeys={new Set([status])}
            onSelectionChange={handleStatusSelection}
          >
            <SelectItem key="pending" textValue="Pendente">
              Pendente
            </SelectItem>
            <SelectItem key="approved" textValue="Aprovado">
              Aprovado
            </SelectItem>
          </Select>

          <Divider />
          <div className="flex flex-col gap-2">
            <p className="text-sm ">Dados da Oferta</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Avatar
                  src="https://picsum.photos/200/300"
                  size="lg"
                  radius="md"
                  classNames={{
                    base: "h-20 w-20 min-h-20 min-w-20 shrink-0",
                    img: "object-cover",
                  }}
                />
                <div className="flex flex-col gap-1">
                  <h1 className="text-lg font-bold">Método Turbo Slim 3.0</h1>
                  <p className="text-sm text-default-400">MTS-30</p>
                  <p className="text-sm text-default-400">Método Turbo Slim 3.0</p>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex flex-col gap-2">
            <p className="text-sm ">URL da Biblioteca</p>
            <div className="flex items-center gap-2 bg-content2/40 rounded-md p-3">
              <Icon icon="solar:link-linear" width={16} height={16} className="text-primary" />
              <p className="text-sm text-primary">https://www.google.com</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm ">Observações</p>
            <Textarea placeholder="Digite suas observações (opcional)" radius="md" size="sm" />
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>

    <Modal
      hideCloseButton
      isOpen={isApproveModalOpen}
      size="md"
      onOpenChange={handleApproveModalOpenChange}
    >
      <ModalContent className="bg-content1">
        <ModalHeader className="flex flex-col gap-1 pb-0 pt-6">
          <h2 className="text-lg font-bold text-foreground">Aprovar solicitação?</h2>
        </ModalHeader>
        <ModalBody className="pt-2 pb-6">
          <p className="text-sm leading-relaxed text-default-400">
            O usuário <span className="font-bold text-foreground">{requesterName}</span> será notificado
            de que sua solicitação foi aprovada. Deseja continuar?
          </p>
        </ModalBody>
        <ModalFooter className="justify-end gap-2 py-4">
          <Button radius="md" onPress={() => setIsApproveModalOpen(false)}>
            Cancelar
          </Button>
          <Button color="primary" radius="md" onPress={handleConfirmApprove}>
            Sim, aprovar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
};
