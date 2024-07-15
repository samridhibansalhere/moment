export interface UserType {
    _id: string;
    name: string;
    email: string;
    bio?: string;
    profilePic: string;
    followers: string[];
    following: string[];
    followRequestsSent: string[];
    followRequestsReceived: string[];
    isPrivateAccount: boolean;
    createdAt: string;
  }
  
  export interface PostType {
    _id: string;
    user: UserType;
    media: string[];
    caption: string;
    hashTags: string[];
    tags: UserType[];
    likedBy: string[];
    savedBy: string[];
    commentsCount: number;
    sharesCount: number;
    isArchived: boolean;
    createdAt: string;
  }
  
  export interface CommentType {
    _id: string;
    post: string;
    user: UserType;
    content: string;
    isReply: boolean;
    replyTo: string;
    repliesCount: number;
    createdAt: string;
  }
  
  export interface NotificationType {
    _id: string;
    user: UserType;
    type: string;
    text: string;
    onClickPath: string;
    read: boolean;
    createdAt: string;
  }