import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalProps } from "@heroui/react";

import { RemoveIcon } from "@/components/icons";

interface ModalRemoveProps extends Omit<ModalProps, "children"> {
  title: string;
  text?: string;
  isLoading?: boolean;
  onRemove: () => void;
  onOpenChange: () => void;
  textButtonCancel?: string;
  textButtonConfirm?: string;
}

export const ModalRemove = ({
  title,
  text,
  isLoading,
  onRemove,
  onOpenChange,
  textButtonCancel,
  textButtonConfirm,
  ...rest
}: ModalRemoveProps) => {
  return (
    <Modal {...rest} hideCloseButton size="xl" onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalBody className="text-foreground-600 flex items-center justify-center pt-6 pb-12 text-center">
              <RemoveIcon />
              <h3 className="text-xl font-bold">{title}</h3>
              <p>{text || "Após excluir, não é possível a recuperação."}</p>
            </ModalBody>
            <ModalFooter className="border-divider border-t">
              <Button fullWidth onClick={onOpenChange}>
                {textButtonCancel || "Cancelar"}
              </Button>
              <Button fullWidth color="danger" isLoading={isLoading} onClick={onRemove}>
                {textButtonConfirm || "Excluir"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
