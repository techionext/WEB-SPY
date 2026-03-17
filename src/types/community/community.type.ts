export type ICommunityVideoGroup = {
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
  } | null;
  thumbnail: {
    id: string;
    url: string;
    mimeType: string;
  };
  creators: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  id: string;
  code: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export namespace ICommunityVideoGroupDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
  };
  export type Result = {
    data: ICommunityVideoGroup[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export type ICommunityVideo = {
  isFavorite: boolean;
  reactionType: "LIKE" | "DISLIKE";
  totalLikes: number;
  totalDislikes: number;
  totalComments: number;
  thumbnail: {
    id: string;
    url: string;
  };
  video: {
    id: string;
    url: string;
  };
  contentCreator: {
    name: string;
    id: string;
    avatar: {
      id: string;
      url: string;
    };
  };
  videoGroup: {
    id: string;
    title: string;
  };
  offer: {
    id: string;
    title: string;
  };
  id: string;
  title: string;
  description: string;
  category: string;
  totalViews: number;
  contentCreatorId: string;
  processStatus: "UPLOADING" | "PROCESSING" | "COMPLETED";
  videoGroupId: string;
  offerId: string;
  createdAt: string;
  updatedAt: string;
  isMain: boolean;
};

export namespace ICommunityVideoDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
    hasOffers?: boolean;
    offersIds?: string[];
    contentCreator?: string[];
    orderBy?: string;
    orderByType?: string;
    isFavorite?: boolean;
    videoGroup: string[];
  };
  export type Result = {
    data: ICommunityVideo[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export namespace ICommunityCategoryDTO {
  export type Args = {
    id: string;
  };
  export type Result = {
    data: string[];
  };
}

export namespace ICommunityCreatorsDTO {
  export type Args = {
    id: string;
    pageSize?: number;
    page?: number;
    filter?: string;
  };
  export type Result = {
    data: {
      id: string;
      code: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      avatar: {
        url: string;
        mimeType: string;
      };
    }[];
  };
}

export namespace IFavoriteVideoDTO {
  export type Args = {
    id: string;
  };
  export type Result = {
    codeIntern: string;
    message: string;
  };
}
