export interface User {
  _id: string;
  username: string;
  email?: string;
  password?: string;
  profileImage: string;
  chats: []
  createdAt?: string;
  updatedAt?: string;
}



export interface UserSession {
  _id: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}