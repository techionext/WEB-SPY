"use client";

import {
  IUpload,
  removeUpload,
  setUploadProgress,
  setUploadStatus,
  updateUpload,
} from "@/features/upload.slice";
import { useAppDispatch } from "@/hooks/redux-hook";
import { Button, Progress } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useRef, useState } from "react";
import { useTusStore } from "use-tus";
import { useRouter } from "next/navigation";
import { fileCacheUtils } from "@/utils/file-cache";
import { DropzoneWrapper, FileTypes } from "../dropzone-wrapper/dropzone-wrapper";
import { api } from "@/libs/api";

interface UploadingItemProps {
  upload: IUpload;
  isVisible: boolean;
}

export const UploadingItem = ({ upload: dataUpload, isVisible }: UploadingItemProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isConfiguredRef = useRef(false);

  const [eta, setEta] = useState<number>(0);
  const lastProgressRef = useRef<{ bytes: number; timestamp: number } | null>(null);

  const uploadId = `upload-${dataUpload.id}`;
  const {
    isUploading,
    isSuccess,
    error: tusError,
    setUpload,
    upload,
    remove,
  } = useTusStore(uploadId, {});

  useEffect(() => {
    if (upload && !dataUpload.isPaused && dataUpload.status === "draft") {
      startOrResumeUpload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upload, dataUpload.isPaused]);

  const fileCache = fileCacheUtils.get(dataUpload.id);

  const handleUpload = (file: File) => {
    setUpload(file, {
      endpoint: `${process.env.NEXT_PUBLIC_API_URL}tus/files`,
      metadata: {
        id: dataUpload.id,
        type: dataUpload.type,
        title: dataUpload.name,
      },
      onProgress: (bytesUploaded: number, bytesTotal: number) => {
        const percentage = Number(((bytesUploaded / bytesTotal) * 100).toFixed(2));
        dispatch(setUploadProgress({ id: dataUpload.id, progress: percentage }));

        const currentTime = Date.now();
        if (lastProgressRef.current) {
          const timeDiff = (currentTime - lastProgressRef.current.timestamp) / 1000;
          const bytesDiff = bytesUploaded - lastProgressRef.current.bytes;

          if (timeDiff > 0 && bytesDiff > 0) {
            const currentSpeed = bytesDiff / timeDiff;
            const bytesRemaining = bytesTotal - bytesUploaded;
            const etaSeconds = bytesRemaining / currentSpeed;
            setEta(etaSeconds);
          }
        }

        lastProgressRef.current = {
          bytes: bytesUploaded,
          timestamp: currentTime,
        };
      },
      onSuccess: () => {
        dispatch(setUploadStatus({ id: dataUpload.id, status: "success" }));
        setEta(0);
        lastProgressRef.current = null;
      },
      onError: (error: Error) => {
        dispatch(
          setUploadStatus({
            id: dataUpload.id,
            status: "error",
            error: error.message || "Erro ao fazer upload",
          }),
        );
        setEta(0);
        lastProgressRef.current = null;
      },
    });
  };

  const startOrResumeUpload = async () => {
    if (!upload) return;

    try {
      // Verifica se há uploads anteriores para continuar
      const previousUploads = await upload.findPreviousUploads();
      const previousUpload = previousUploads.find(
        (prev) => prev.metadata?.videoId === dataUpload.id,
      );

      if (previousUpload) {
        upload.resumeFromPreviousUpload(previousUpload);
      }

      dispatch(updateUpload({ id: dataUpload.id, status: "uploading", isPaused: false }));
      upload.start();
    } catch (error) {
      dispatch(
        setUploadStatus({
          id: dataUpload.id,
          status: "error",
          error: error instanceof Error ? error.message : "Erro ao iniciar upload",
        }),
      );
    }
  };

  const handlePauseUpload = () => {
    if (upload && isUploading) {
      upload.abort();
      dispatch(updateUpload({ id: dataUpload.id, status: "draft", isPaused: true }));
      setEta(0);
      lastProgressRef.current = null;
    }
  };

  const handlePlayOrPauseUpload = () => {
    if (isUploading) {
      handlePauseUpload();
    } else {
      startOrResumeUpload();
    }
  };

  const handleAccessVideo = () => {
    dispatch(removeUpload(dataUpload.id));

    if (dataUpload.type === "VSL") {
      dispatch(api.util.invalidateTags([{ type: "vsls", id: "LIST" }]));
      router.push(`/offers/${dataUpload.offerId}/vsls`);
    } else {
      router.push(`/community/video/${dataUpload.id}`);
    }
  };

  const handleRemoveUpload = () => {
    if (upload) {
      remove();
    }
    // Remove do cache também (o removeUpload já faz isso, mas garantimos aqui)
    fileCacheUtils.remove(dataUpload.id);
    dispatch(removeUpload(dataUpload.id));
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatETA = (seconds: number): string => {
    if (seconds === 0 || !isFinite(seconds)) return "";

    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `${minutes}m ${secs}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  const fileSize = dataUpload.fileSize;

  const getStatusColor = (): "warning" | "primary" | "success" | "danger" => {
    switch (dataUpload.status) {
      case "success":
        return "success";
      case "error":
        return "danger";
      case "uploading":
        return "primary";
      default:
        return "warning";
    }
  };

  const handleSelectFile = (file: File) => {
    if (file) {
      fileCacheUtils.set(dataUpload.id, file);
      handleUpload(file);
      dispatch(
        updateUpload({
          id: dataUpload.id,
          status: "draft",
          isPaused: false,
          progress: 0,
          fileSize: file.size,
          fileType: file.type,
          fileName: file.name,
        }),
      );
    }
  };

  useEffect(() => {
    // Busca o arquivo do cache (não do Redux)

    // Se já está configurado OU já existe um upload configurado, não reconfigura
    // IMPORTANTE: Verificamos upload primeiro porque pode existir mesmo se isConfiguredRef foi resetado
    if (upload) {
      // Se o upload já existe, marca como configurado para evitar reconfiguração
      if (!isConfiguredRef.current) {
        isConfiguredRef.current = true;
      }
      return;
    }

    // Se já foi configurado mas o upload não existe mais, não tenta reconfigurar
    // (pode ter sido removido intencionalmente)
    if (isConfiguredRef.current) {
      return;
    }

    if (!fileCache) {
      return;
    }

    handleUpload(fileCache);

    isConfiguredRef.current = true;
    // Removemos as dependências que podem causar re-execução desnecessária
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpload.id]);

  useEffect(() => {
    if (isSuccess && dataUpload.status !== "success") {
      dispatch(setUploadStatus({ id: dataUpload.id, status: "success" }));
    }
    if (tusError && dataUpload.status !== "error") {
      dispatch(
        setUploadStatus({
          id: dataUpload.id,
          status: "error",
          error: tusError.message || "Erro desconhecido",
        }),
      );
    }
  }, [isSuccess, tusError, dataUpload.status, dataUpload.id, dispatch]);

  return (
    <div
      className="flex justify-between items-center gap-2 p-2 hover:bg-content2 rounded-large transition-colors"
      style={{ display: isVisible ? "flex" : "none" }}
    >
      <div className="size-10 aspect-square rounded-large bg-default-200 flex-shrink-0 justify-center items-center flex overflow-hidden relative">
        <Icon icon="solar:play-bold" width={16} className="text-default-700" />
      </div>

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex flex-col flex-1">
          <p className="text-small font-medium truncate">{dataUpload.name}</p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-tiny font-light text-foreground-500">
              {fileCache ? formatFileSize(fileSize) : "Selecione um arquivo"}
            </p>
            {isUploading && eta > 0 && (
              <p className="text-tiny text-foreground-400">
                {formatETA(eta)} restante{eta > 60 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
        {fileCache && (
          <Progress
            size="sm"
            value={dataUpload.progress}
            maxValue={100}
            color={getStatusColor()}
            aria-label={`Progresso do upload: ${dataUpload.progress}%`}
          />
        )}
        {dataUpload.error && <p className="text-tiny text-danger">{dataUpload.error}</p>}
      </div>
      {fileCache ? (
        dataUpload.status === "success" ? (
          <Button
            isIconOnly
            variant="light"
            size="sm"
            type="button"
            onPress={handleAccessVideo}
            aria-label="Acessar vídeo"
          >
            <Icon icon="solar:play-bold-duotone" width={16} height={16} />
          </Button>
        ) : (
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              isIconOnly
              variant="light"
              type="button"
              onPress={handleRemoveUpload}
              aria-label="Remover upload"
            >
              <Icon icon="solar:trash-bin-trash-bold-duotone" width={16} />
            </Button>
            <Button
              isIconOnly
              variant="light"
              type="button"
              size="sm"
              onPress={handlePlayOrPauseUpload}
              isDisabled={dataUpload.status === "error"}
              aria-label={isUploading ? "Pausar upload" : "Iniciar upload"}
            >
              <Icon
                icon={isUploading ? "solar:pause-bold" : "solar:play-bold"}
                width={16}
                height={16}
              />
            </Button>
          </div>
        )
      ) : (
        <DropzoneWrapper
          acceptedTypes={FileTypes.VIDEO}
          onUploadSuccess={(files) => handleSelectFile(files[0])}
        >
          {({ open }) => (
            <Button isIconOnly size="sm" type="button" onPress={open}>
              <Icon icon="solar:upload-bold" width={16} height={16} />
            </Button>
          )}
        </DropzoneWrapper>
      )}
    </div>
  );
};
