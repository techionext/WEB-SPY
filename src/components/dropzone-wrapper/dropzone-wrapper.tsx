"use client";

import { cn } from "@heroui/theme";
import { ReactNode, useCallback } from "react";
import { Accept, FileRejection, useDropzone } from "react-dropzone";

export enum FileTypes {
  IMAGE = "image",
  VIDEO = "video",
  ANY = "any",
  CSV = "csv",
  SHEETS = "sheets",
  TEXT = "text",
}

const mimeTypes: { [key in FileTypes]: Accept } = {
  [FileTypes.IMAGE]: { "image/*": [] },
  [FileTypes.VIDEO]: { "video/*": [] },
  [FileTypes.ANY]: {
    "image/*": [],
    "video/*": [],
    "application/pdf": [],
    "application/msword": [],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    "application/vnd.ms-excel": [],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    "audio/*": [],
    "text/csv": [], // Adicionando CSV para o tipo ANY
  },
  [FileTypes.CSV]: {
    "text/csv": [], // Aceitar arquivos CSV
  },
  [FileTypes.SHEETS]: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [] },
  [FileTypes.TEXT]: {
    "text/plain": [".txt"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  },
};

interface IDropzoneWrapper {
  onUploadSuccess?: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes: FileTypes;
  maxFileSize?: number;
  onError?: (error: Error) => void;
  children: (props: {
    isDragAccept: boolean;
    isDragReject: boolean;
    open?: () => void;
  }) => ReactNode;
  isDisabled?: boolean;
}
export const DropzoneWrapper = ({
  acceptedTypes,
  maxFileSize,
  maxFiles,
  onError,
  onUploadSuccess,
  children,
  isDisabled,
}: IDropzoneWrapper) => {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0 && onError) {
        const error = new Error("Arquivo não suportado ou excede o tamanho máximo permitido.");

        onError(error);
      }

      const validFiles = acceptedFiles.slice(0, maxFiles);

      if (onUploadSuccess) {
        onUploadSuccess(validFiles);
      }
    },
    [maxFiles, onUploadSuccess, onError],
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject, open } = useDropzone({
    onDrop,
    accept: mimeTypes[acceptedTypes],
    maxFiles,
    maxSize: maxFileSize,
    disabled: isDisabled,
  });

  return (
    <div {...getRootProps()} className={cn([])}>
      <input {...getInputProps()} />
      {children({ isDragAccept, isDragReject, open })}
    </div>
  );
};
