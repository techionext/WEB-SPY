export type ICommunityArea = {
  totalVideos: number;
  mainVideo: {
    thumbnail: {
      id: string;
      url: string;
    };
    video: {
      id: string;
      url: string;
    };
    id: string;
    title: string;
    description: string;
    category: string;
    isMain: boolean;
    totalViews: number;
  };
  creators: [
    {
      id: string;
      name: string;
      avatar: string;
    },
  ];
  thumbnail: {
    id: string;
    url: string;
    mimeType: string;
  };
  id: string;
  code: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export namespace ICommunityAreaDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: ICommunityArea[];
    meta: {
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    };
  };
}

export namespace ICreateCommunityAreaDTO {
  export type Args = {
    title: string;
    image?: File;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}

export namespace IUpdateCommunityAreaDTO {
  export type Args = {
    id: string;
    title: string;
    image?: File;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}
