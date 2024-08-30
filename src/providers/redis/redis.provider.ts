import { Redis } from 'ioredis';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const REDIS_SESSION: Provider = {
    provide: 'REDIS_SESSION',
    useFactory: async (config: ConfigService) => {
        const REDIS_HOST = config.get<string>('REDIS_HOST'); 
        const REDIS_PORT = config.get<number>('REDIS_PORT'); 
        const REDIS_PASSWORD = config.get<string>('REDIS_PASSWORD'); 
        const REDIS_INDEX_SESSION = config.get<number>('REDIS_INDEX_SESSION');
        
        const client: Redis = new Redis({
            host: REDIS_HOST,
            port: REDIS_PORT,
            password: REDIS_PASSWORD,
            db: REDIS_INDEX_SESSION,
        });

        client.on('error', (err: any) => {
            console.log('[Redis] : REDIS_SESSION', err);
        });

        client.on('connect', () => {
            console.log('[Redis] : REDIS_SESSION Connected');
        });

        return client;
    },
    inject: [ConfigService],
};
