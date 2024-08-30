import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (config: ConfigService): Promise<typeof mongoose> => {
      mongoose.set('strictQuery', false);
      const debug = config.get('DEBUG') == 'true';

      mongoose.set('debug', debug);
      // handlers
      mongoose.connection.on('connecting', () => {
        console.info('[MongoDB] connecting');
      });
      mongoose.connection.on('error', (error: any) => {
        console.error(`[MongoDB] connection ${error}`);
        mongoose.disconnect();
      });
      mongoose.connection.on('connected', async () => {
        // console.info('MongoDB = ' + config.get('DB_URL'));
        console.info('[MongoDB] connected');
      });
      mongoose.connection.once('open', () => {
        console.info('[MongoDB] connection opened');
      });
      mongoose.connection.on('reconnected', () => {
        console.warn('[MongoDB] reconnected');
      });

      mongoose.connection.on('reconnectFailed', () => {
        console.error('[MongoDB] reconnectFailed');
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('[MongoDB] disconnected');
      });

      mongoose.connection.on('full-setup', () => {
        console.debug('[MongoDB] reconnecting... %d');
      });

      return mongoose.connect(
        config.get('DB_URL') || 'mongodb://localhost:27017',
      );
    },
    inject: [ConfigService],
  },
];
