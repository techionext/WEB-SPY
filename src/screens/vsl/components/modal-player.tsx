import { Button, Modal, ModalBody, ModalContent } from "@heroui/react";
import { Icon } from "@iconify/react";
import { VslPlayerContent } from "@/components/vsl/vsl-player-content";
import { ILabsVsl } from "@/types/labs/vsls/labs-vsls.type";

interface ModalPlayerProps {
  vsl: ILabsVsl;
  isOpen: boolean;
  onOpenChange: () => void;
}

export const ModalPlayer = ({ vsl, isOpen, onOpenChange }: ModalPlayerProps) => {
  return (
    <Modal
      backdrop="blur"
      className="border border-default-100 bg-content1"
      hideCloseButton
      isOpen={isOpen}
      scrollBehavior="inside"
      size="4xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent className="overflow-hidden p-0">
        {(onClose) => (
          <ModalBody className="gap-0 p-0">
            <VslPlayerContent
              vsl={vsl}
              videoPlayerClassName="rounded-none"
              topRightSlot={
                <Button
                  isIconOnly
                  className="bg-content1/40 text-white backdrop-blur-md hover:bg-content1/60"
                  size="sm"
                  variant="flat"
                  onPress={onClose}
                >
                  <Icon height={20} icon="solar:close-circle-bold" width={20} />
                </Button>
              }
            />
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
};
