export type ILabsVsl = {
  id: string;
  title: string;
  description: string;
  offerId: string;
  createdAt: string;
  updatedAt: string;
  video: {
    id: string;
    url: string;
    key: string;
    mimeType?: string;
    processStatus?: "UPLOADING" | "COMPLETED" | "PROCESSING";
  };
  processStatus: "UPLOADING" | "COMPLETED" | "PROCESSING";
  transcriptionVsl: {
    id: string;
    text: string;
    url: string;
    key: string;
  } | null;
};

export type ILabsVslById = {
  data: {
    video: {
      id: string;
      url: string;
      key: string;
    };
    transcriptionVsl: {
      file: {
        id: string;
        offerId: string;
        createdAt: string;
        updatedAt: string;
        url: string;
        size: number;
        originalName: string;
        mimeType: string;
        key: string;
        creativeId: string;
        pageImageId: string;
        pageFileId: string;
        userId: string;
        categoryId: string;
        vslId: string;
        transcriptionVslId: string;
        contentCreatorsId: string;
        videoGroupsId: string;
        videoFileId: string;
        videoThumbnailId: string;
        boardRankingImageId: string;
        boardRankingIconId: string;
        boardRewardsId: string;
      };
      id: string;
      createdAt: string;
      updatedAt: string;
      vslId: string;
      text: string;
    };
    id: string;
    title: string;
    description: string;
    offerId: string;
    createdAt: string;
    updatedAt: string;
  };
};

export namespace ICreateLabsVSLDTO {
  export type Args = {
    title: string;
    description?: string;
    video?: File;
    transcription?: File | { id: string; text: string };
    offerId: string;
  };
  export type Result = {
    id: string;
    codeIntern: string;
    message: string;
  };
}

export namespace ILabsVSLSDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
    offerId?: string;
  };
  export type Result = {
    data: ILabsVsl[];
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}

export namespace IUpdateLabsVSLDTO {
  export type Args = {
    id: string;
    title: string;
    description?: string;
    video?: File;
    transcription?: File | { id: string; text: string };
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace ILabsVslUploadingDTO {
  export type Args = {
    offerId?: string;
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: {
      id: string;
      title: string;
      description: string;
      offerId: string;
      processStatus: "UPLOADING" | "COMPLETED" | "PROCESSING";
      transcriptionVsl: {
        id: string;
        text: string;
        url: string;
        key: string;
      };
    }[];
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}
