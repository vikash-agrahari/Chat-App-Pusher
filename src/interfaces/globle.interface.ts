import { User } from 'src/modules/on-boarding/interfaces/on-boarding.interface';

interface Response {
  status: number;
  message: string;
  timestamp: number;
}

export interface IHttpResponse extends Response {
  data: Record<string, any> | null;
  error: Record<string, any> | null;
}

export interface SessionData {
  sessionId: string;
  userId: string;
  userData: User;
}
