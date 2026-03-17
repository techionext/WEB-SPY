"use client";

import { useAppSelector } from "@/hooks/redux-hook";
import { Button, Badge, Tabs, Tab, Progress, useDisclosure, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useMemo, useState, useEffect, useRef } from "react";
import { UploadingItem } from "./uploading-item";
import { useGetLabsVSLUploadingQuery } from "@/services/labs/vsls/labs-vsls.service";
import { useGetVideoUploadingQuery } from "@/services/community/video-id.service";

export const PopoverUploading = () => {
  const { uploads, lastUploadType } = useAppSelector((state) => state.upload);
  const [selectedTab, setSelectedTab] = useState<"ACADEMY_VIDEO" | "VSL">(
    lastUploadType || "ACADEMY_VIDEO",
  );
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const previousUploadsLength = useRef(uploads.length);
  const popoverRef = useRef<HTMLDivElement>(null);
  const uploadStatusRef = useRef<Map<string, string>>(new Map());

  // Conta uploads ativos (draft ou uploading)
  const activeUploadsCount = useMemo(
    () => uploads.filter((u) => u.status === "draft" || u.status === "uploading").length,
    [uploads],
  );

  const completedCount = useMemo(
    () => uploads.filter((u) => u.status === "success").length,
    [uploads],
  );

  const errorCount = useMemo(() => uploads.filter((u) => u.status === "error").length, [uploads]);

  const globalProgress = useMemo(() => {
    if (uploads.length === 0) return 0;
    const totalProgress = uploads.reduce((acc, upload) => {
      if (upload.status === "success") return acc + 100;
      if (upload.status === "error") return acc + 0;
      return acc + upload.progress;
    }, 0);
    return Math.round(totalProgress / uploads.length);
  }, [uploads]);

  useEffect(() => {
    if (uploads.length > previousUploadsLength.current) {
      onOpen();
      if (lastUploadType) {
        setSelectedTab(lastUploadType);
      }
    }
    previousUploadsLength.current = uploads.length;
  }, [uploads.length, lastUploadType, onOpen]);

  useEffect(() => {
    uploads.forEach((upload) => {
      const previousStatus = uploadStatusRef.current.get(upload.id);

      if (previousStatus === "uploading" && upload.status === "success") {
        addToast({
          title: "Upload concluído!",
          description: `${upload.name} foi enviado com sucesso.`,
          color: "success",
          icon: <Icon icon="solar:check-circle-bold" width={20} />,
        });
      }

      if (
        (previousStatus === "uploading" || previousStatus === "draft") &&
        upload.status === "error"
      ) {
        addToast({
          title: "Erro no upload",
          description: upload.error || `Falha ao enviar ${upload.name}.`,
          color: "danger",
          icon: <Icon icon="solar:danger-circle-bold" width={20} />,
        });
      }

      uploadStatusRef.current.set(upload.id, upload.status);
    });

    const currentUploadIds = new Set(uploads.map((u) => u.id));
    uploadStatusRef.current.forEach((_, id) => {
      if (!currentUploadIds.has(id)) {
        uploadStatusRef.current.delete(id);
      }
    });
  }, [uploads]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useGetVideoUploadingQuery({});
  useGetLabsVSLUploadingQuery({});

  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-fit z-50" ref={popoverRef}>
      <Badge
        content={activeUploadsCount > 0 ? activeUploadsCount : completedCount}
        color={errorCount > 0 ? "danger" : activeUploadsCount > 0 ? "primary" : "success"}
        isInvisible={uploads.length === 0}
        showOutline={false}
      >
        <Button
          isIconOnly
          variant="solid"
          color={errorCount > 0 ? "danger" : "primary"}
          aria-label={`Uploads: ${activeUploadsCount} em andamento, ${completedCount} concluídos, ${errorCount} com erro`}
          className="shadow-lg"
          onPress={() => onOpenChange()}
        >
          <Icon icon="solar:upload-bold" width={20} height={20} />
        </Button>
      </Badge>

      <div
        className={`absolute p-2 bottom-full mb-2 left-1/2 -translate-x-1/2 min-w-[400px] max-w-[500px] bg-content1 rounded-large shadow-large border border-divider transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="p-2">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col gap-2 px-2 pb-2 border-b border-divider">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Uploads</h3>
                <span className="text-xs text-foreground-500">
                  {completedCount} de {uploads.length}{" "}
                  {uploads.length === 1 ? "concluído" : "concluídos"}
                </span>
              </div>
              {activeUploadsCount > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground-500">Progresso geral</span>
                    <span className="text-xs font-medium">{globalProgress}%</span>
                  </div>
                  <Progress
                    size="sm"
                    value={globalProgress}
                    color="primary"
                    className="w-full"
                    aria-label="Progresso geral dos uploads"
                  />
                </div>
              )}
            </div>
            <Tabs
              fullWidth
              size="sm"
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as "ACADEMY_VIDEO" | "VSL")}
            >
              <Tab title="Vídeo" key="ACADEMY_VIDEO" />
              <Tab title="VSLs" key="VSL" />
            </Tabs>
            <div className="flex flex-col gap-1 max-h-[400px] min-h-[140px] overflow-y-auto">
              {uploads.some((u) => u.type === selectedTab) ? (
                uploads.map((upload) => (
                  <UploadingItem
                    key={upload.id}
                    upload={upload}
                    isVisible={upload.type === selectedTab}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Icon
                    icon="solar:cloud-upload-linear"
                    width={48}
                    height={48}
                    className="text-foreground-300 mb-2"
                  />
                  <p className="text-sm text-foreground-500">
                    Nenhum upload de {selectedTab === "ACADEMY_VIDEO" ? "vídeo" : "VSL"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
