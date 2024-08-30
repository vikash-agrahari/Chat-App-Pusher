import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPusherConnection } from './pusher.connection';
import * as Pusher from 'pusher';

@Injectable()
export class PusherService {
  pusher: Pusher;

  constructor(private config: ConfigService) {
    this.pusher = createPusherConnection(this.config);
  }

  async trigger(channel: string, event: string, data: any, socketId: string) {
    try {
      return await this.pusher.trigger(channel, event, data, { socket_id: socketId });
    } catch (error) {
      console.error('Error triggering Pusher event:', error);
    }
  }

  async triggerInBatches(events: Pusher.BatchEvent[]) {
    try {
      return await this.pusher.triggerBatch(events);
    } catch (error) {
      console.error('Error triggering Pusher event:', error);
    }
  }
}
