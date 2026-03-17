import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/libs/store";
import { videoIdServices } from "@/services/community/video-id.service";
import { labsVSLSservices } from "@/services/labs/vsls/labs-vsls.service";
import { fileCacheUtils } from "@/utils/file-cache";

export type UploadStatus = "draft" | "uploading" | "success" | "error";

export type IUpload = {
  id: string;
  name: string;
  progress: number;
  type: "ACADEMY_VIDEO" | "VSL";
  offerId?: string;
  // Metadados do arquivo (serializáveis) - o objeto File fica no cache
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  status: UploadStatus;
  error?: string;
  isPaused?: boolean;
};

type UploadState = {
  uploads: IUpload[];
  lastUploadType: "ACADEMY_VIDEO" | "VSL" | null;
};

const initialState: UploadState = {
  uploads: [],
  lastUploadType: null,
};

// Função helper para limpar qualquer File do estado
const cleanUploadState = (state: UploadState) => {
  state.uploads = state.uploads.map((upload) => {
    const uploadAny = upload as any;
    if (uploadAny.file && uploadAny.file instanceof File) {
      // Se encontrar um File, move para o cache e remove do estado
      fileCacheUtils.set(upload.id, uploadAny.file);
      // Cria um novo objeto sem a propriedade file
      const cleanUpload: IUpload = {
        id: upload.id,
        name: upload.name,
        progress: upload.progress,
        type: upload.type,
        offerId: upload.offerId,
        isPaused: false,
        fileName: upload.fileName,
        fileSize: upload.fileSize,
        fileType: upload.fileType,
        status: upload.status,
        error: upload.error,
      };
      return cleanUpload;
    }
    return upload;
  });
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    addUpload: (state, action: PayloadAction<IUpload>) => {
      // Limpa qualquer File que possa estar no estado atual
      cleanUploadState(state);

      // Evita duplicatas
      const exists = state.uploads.some((upload) => upload.id === action.payload.id);
      if (!exists) {
        // Remove qualquer propriedade 'file' que possa ter sido passada incorretamente
        const payloadAny = action.payload as any;
        const { file, ...uploadWithoutFile } = payloadAny;
        if (file && file instanceof File) {
          // Se houver um arquivo, armazena no cache
          fileCacheUtils.set(action.payload.id, file);
        }
        state.uploads.push(uploadWithoutFile as IUpload);
        state.lastUploadType = action.payload.type;
      }
    },
    removeUpload: (state, action: PayloadAction<string>) => {
      state.uploads = state.uploads.filter((upload) => upload.id !== action.payload);
      // Remove o arquivo do cache também
      fileCacheUtils.remove(action.payload);
    },
    updateUpload: (state, action: PayloadAction<Partial<IUpload> & { id: string }>) => {
      const index = state.uploads.findIndex((upload) => upload.id === action.payload.id);
      if (index !== -1) {
        // Remove qualquer propriedade 'file' que possa ter sido passada incorretamente
        const { file, ...updateWithoutFile } = action.payload as any;
        if (file) {
          // Se houver um arquivo, armazena no cache
          fileCacheUtils.set(action.payload.id, file);
        }
        state.uploads[index] = { ...state.uploads[index], ...updateWithoutFile };
      }
    },
    setUploadProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const upload = state.uploads.find((u) => u.id === action.payload.id);
      if (upload) {
        upload.progress = action.payload.progress;
        upload.status = "uploading";
      }
    },
    setUploadStatus: (
      state,
      action: PayloadAction<{ id: string; status: UploadStatus; error?: string }>,
    ) => {
      const upload = state.uploads.find((u) => u.id === action.payload.id);
      if (upload) {
        upload.status = action.payload.status;
        if (action.payload.error) {
          upload.error = action.payload.error;
        }
      }
    },
    clearCompletedUploads: (state) => {
      state.uploads = state.uploads.filter(
        (upload) => upload.status !== "success" && upload.status !== "error",
      );
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      videoIdServices.endpoints.postVideoCommunity.matchFulfilled,
      (state, { payload, meta }) => {
        // Limpa qualquer File que possa estar no estado ANTES de processar
        cleanUploadState(state);

        const { title, video } = meta.arg.originalArgs;
        const exists = state.uploads.some((upload) => upload.id === payload.id);

        if (!exists && video) {
          // Armazena o arquivo no cache (fora do Redux)
          fileCacheUtils.set(payload.id, video);

          // Armazena apenas metadados serializáveis no Redux
          const newUpload: IUpload = {
            id: payload.id,
            name: title,
            progress: 0,
            type: "ACADEMY_VIDEO",
            fileName: video.name,
            fileSize: video.size,
            fileType: video.type,
            status: "draft",
          };

          state.uploads.push(newUpload);
          state.lastUploadType = "ACADEMY_VIDEO";
        }
      },
    );
    builder.addMatcher(
      labsVSLSservices.endpoints.createLabsVSL.matchFulfilled,
      (state, { payload, meta }) => {
        cleanUploadState(state);

        const { title, offerId, video } = meta.arg.originalArgs;
        const exists = state.uploads.some((upload) => upload.id === payload.id);

        if (!exists && video) {
          fileCacheUtils.set(payload.id, video);

          const newUpload: IUpload = {
            id: payload.id,
            name: title,
            progress: 0,
            type: "VSL" as const,
            offerId: offerId,
            fileName: video.name,
            fileSize: video.size,
            fileType: video.type,
            status: "draft",
          };

          state.uploads.push(newUpload);
          state.lastUploadType = "VSL";
        }
      },
    );
    builder.addMatcher(
      labsVSLSservices.endpoints.updateLabsVSL.matchFulfilled,
      (state, { meta }) => {
        cleanUploadState(state);

        const { id, title, video } = meta.arg.originalArgs;
        const exists = state.uploads.some((upload) => upload.id === id);

        if (!exists && video) {
          fileCacheUtils.set(id, video);

          const newUpload: IUpload = {
            id: id,
            name: title,
            progress: 0,
            type: "VSL" as const,
            fileName: video.name,
            fileSize: video.size,
            fileType: video.type,
            status: "draft",
          };

          state.uploads.push(newUpload);
          state.lastUploadType = "VSL";
        }
      },
    );
    builder.addMatcher(
      videoIdServices.endpoints.getVideoUploading.matchFulfilled,
      (state, { payload }) => {
        if (!payload?.data) state;

        const videoUploads = payload.data.map((video) => ({
          id: video.id,
          name: video.title,
          progress: 0,
          type: "ACADEMY_VIDEO" as const,
          status: "draft" as UploadStatus,
        }));

        state.uploads.push(...videoUploads);
      },
    );
    builder.addMatcher(
      labsVSLSservices.endpoints.getLabsVSLUploading.matchFulfilled,
      (state, { payload }) => {
        if (!payload?.data) state;

        const vslUploads = payload.data.map((video) => ({
          id: video.id,
          name: video.title,
          progress: 0,
          type: "VSL" as const,
          offerId: video.offerId,
          status: "draft" as UploadStatus,
        }));

        state.uploads.push(...vslUploads);
      },
    );
  },
});

export const {
  addUpload,
  removeUpload,
  updateUpload,
  setUploadProgress,
  setUploadStatus,
  clearCompletedUploads,
} = uploadSlice.actions;

export default uploadSlice.reducer;

export const selectUpload = (state: RootState) => state.upload;
export const selectUploadById = (state: RootState, id: string) =>
  state.upload.uploads.find((upload) => upload.id === id);
export const selectActiveUploads = (state: RootState) =>
  state.upload.uploads.filter(
    (upload) => upload.status === "draft" || upload.status === "uploading",
  );
