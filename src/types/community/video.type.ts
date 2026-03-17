export type IVideo = {
  processStatus: "UPLOADING" | "PROCESSING" | "COMPLETED";
  contentCreator: {
    totalVideos: number;
    name: string;
    id: string;
    avatar: {
      id: string;
      url: string;
    };
  };
  reactionType: "LIKE" | "DISLIKE";
  isFavorite: boolean;
  favoriteVideo: [
    {
      id: string;
      videoId: string;
      userId: string;
    },
  ];
  offer: {
    id: string;
    title: string;
  };
  videoGroup: {
    id: string;
    title: string;
  };
  video: {
    id: string;
    url: string;
  };
  thumbnail: {
    id: string;
    url: string;
  };
  id: string;
  title: string;
  description: string;
  category: string;
  isMain: boolean;
  totalViews: number;
  createdAt: string;
  updatedAt: string;
};

export namespace IVideoGetDTO {
  export type Args = {
    id: string;
  };
  export type Result = IVideo;
}

export namespace IReactionVideoDTO {
  export type Args = {
    id: string;
    type: "LIKE" | "DISLIKE";
  };
  export type Result = void;
}

export type ICommentVideo = {
  reactionType: "LIKE" | "DISLIKE";
  totalLike: number;
  totalDislike: number;
  totalReplies: number;
  user: {
    name: string;
    id: string;
    avatar: {
      id: string;
      url: string;
    };
  };
  id: string;
  content: string;
  videoId: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
};

export namespace ICommentVideoDTO {
  export type Args = {
    page?: number;
    pageSize?: number;
    filter?: string;
    videoId: string;
  };
  export type Result = {
    data: ICommentVideo[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

export namespace IPostCommentVideoDTO {
  export type Args = {
    content: string;
    videoId: string;
  };
  export type Result = void;
}

export type ICommentVideoById = {
  replies: [
    {
      reactionType: "LIKE" | "DISLIKE";
      totalLike: number;
      totalDislike: number;
      totalReplies: number;
      user: {
        name: string;
        id: string;
        avatar: {
          url: string;
          mimeType: string;
        } | null;
      };
      id: string;
      content: string;
      createdAt: string;
      updatedAt: string;
    },
  ];
  reactionType: "LIKE" | "DISLIKE";
  totalLike: number;
  totalDislike: number;
  totalReplies: number;
  user: {
    name: string;
    id: string;
    avatar: {
      id: string;
      url: string;
    };
  };
  id: string;
  content: string;
  videoId: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
};
export namespace ICommentVideoByIdDTO {
  export type Args = {
    id: string;
  };
  export type Result = ICommentVideoById;
}

export namespace IPostCommentVideoReplyDTO {
  export type Args = {
    content: string;
    id: string;
  };
  export type Result = ICommentVideoById;
}

export namespace IReactionCommentVideoDTO {
  export type Args = {
    id: string;
    type: "LIKE" | "DISLIKE";
  };
  export type Result = IVideo;
}

export namespace IPostVideoCommunityDTO {
  export type Args = {
    title: string;
    description?: string;
    category: string;
    videoGroupId: string;
    contentCreatorId: string;
    video?: File;
    thumbnail?: File;
    isMain?: boolean;
  };
  export type Result = {
    id: string;
    codeIntern: string;
    message: string;
  };
}

export namespace IPutVideoCommunityDTO {
  export type Args = {
    id: string;
    title: string;
    description?: string;
    category: string;
    isMain?: boolean;
  };
  export type Result = {
    id: string;
    codeIntern: string;
    message: string;
  };
}

export namespace IGetVideoUploadingDTO {
  export type Args = {};
  export type Result = {
    data: {
      id: string;
      title: string;
      description: string;
      thumbnail: {
        id: string;
        url: string;
      };
      contentCreator: {
        id: string;
        name: string;
        avatar: {
          id: string;
          url: string;
        };
      };
      videoGroup: {
        id: "5302b6b5-0bf4-47c6-92ed-02ce495bb739";
        title: string;
      } | null;
      offer: {
        id: string;
        title: string;
      } | null;
      processStatus: "UPLOADING";
    }[];
  };
}
export namespace ICategoriesVideoDTO {
  export type Args = {
    id: string;
  };
  export type Result = {
    data: string[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
      pageSize: number;
    };
  };
}
