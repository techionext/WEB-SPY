"use client";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { ILabsPage } from "@/types/labs/page/labs-page.type";
import { useArchivePageMutation } from "@/services/labs/page/labs-page.service";
import { Icon } from "@iconify/react";

type ModalUnarchiveProps = {
  page: ILabsPage;
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
};

export const ModalUnarchive = ({ page, isOpen, onOpenChange, onClose }: ModalUnarchiveProps) => {
  const [archivePage, { isLoading }] = useArchivePageMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await archivePage({
      id: page.id,
    })
      .unwrap()
      .then(() => {
        onClose();
      });
  };

  return (
    <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
      <ModalContent as="form" onSubmit={onSubmit}>
        <>
          <ModalHeader className="flex items-center gap-4 py-6 border-b border-default-100/50">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center border-1 border-success/20">
              <Icon icon="solar:archive-check-bold" className="text-success text-2xl" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold leading-tight">Desarquivar Página</h2>
              <p className="text-sm text-default-400 font-medium">
                Esta página voltará a ficar ativa
              </p>
            </div>
          </ModalHeader>
          <ModalBody className="gap-6 pt-6 pb-8">
            <p className="text-sm text-default-500">
              Tem certeza que deseja desarquivar a página <strong>{page.title}</strong>? Ela voltará
              a ser exibida na listagem de páginas ativas.
            </p>
          </ModalBody>
          <ModalFooter className="border-t border-default-100/50 py-6 gap-3">
            <Button fullWidth onPress={onClose} variant="flat">
              Cancelar
            </Button>
            <Button
              fullWidth
              color="success"
              type="submit"
              isLoading={isLoading}
              className="font-bold"
            >
              <Icon icon="solar:archive-check-bold" className="text-lg" />
              Desarquivar agora
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};
