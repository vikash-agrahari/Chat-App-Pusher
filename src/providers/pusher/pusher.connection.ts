import { ConfigService } from '@nestjs/config';
import * as Pusher from 'pusher';

export const createPusherConnection = (config: ConfigService): Pusher => {
  return new Pusher({
    appId: config.get('PUSHER_APP_ID') || '',
    key: config.get('PUSHER_KEY') || '',
    secret: config.get('PUSHER_SECRET') || '',
    cluster: config.get('PUSHER_CLUSTER') || '',
    useTLS: true,
  });
};
