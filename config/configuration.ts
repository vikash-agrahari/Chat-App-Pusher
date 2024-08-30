import { config } from 'dotenv';

const env = process.env.NODE_ENV || false;
if (!env) process.exit(100);

config({ path: `bin/.env.${env}` });

export default () => ({
  PORT: process.env.PORT,
  ENV: process.env.NODE_ENV,
  DB_URL: process.env.URI,
  DB_Name: process.env.DB_NAME,
  PUSHER_APP_ID: process.env.PUSHER_APP_ID,
  PUSHER_KEY: process.env.PUSHER_KEY,
  PUSHER_SECRET: process.env.PUSHER_SECRET,
  PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_INDEX_SESSION: process.env.REDIS_INDEX_SESSION,
  REDIS_USERNAME: process.env.REDIS_USERNAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  AZURE_ACCOUNT_NAME: process.env.AZURE_ACCOUNT_NAME,
  AZURE_ACCOUNT_KEY: process.env.AZURE_ACCOUNT_KEY,
  AZURE_CONTAINER_NAME: process.env.AZURE_CONTAINER_NAME,
});
