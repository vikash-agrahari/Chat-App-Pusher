import { Types } from 'mongoose';

export interface Members {
  _id: Types.ObjectId;
  username: string;
  profileImage: string;
  isAdmin?: boolean;
}

export interface Chat {
  name?: string;
  members: Members[];
  isGroup?: boolean;
  chatPhoto?: string;
  text?: string;
  image?: string;
  video?: string;
  lastMessageAt?: Date;
}