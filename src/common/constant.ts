export const CONSTANT = {
  LOGGER_NAME: 'LOGGER',
  JWT_PASSWORD: 'asdfgh',
  BASIC_PASSWORD: 'Xyz@1234',
  BASIC_USERNAME: 'XYZ',
  PASSWORD_HASH_SALT: 'D4XqxvRjf678LPYZAMNBOT7zkrqG3E2H',
  REDIS: {
    HASH: {
      SESSION: 'sessions_',
    },
    KEY: {
      SESSION: 'SESSION',
    },
    EXPIRY: {
      SESSION_EXPIRE: 60 * 60 * 24 * 30, // 30 days
    },
  },
  PUSHER: {
    EVENTS: {
      NEW_MESSAGE: 'new-message',
      CHAT_UPDATE: 'chat-update'
    },
    PRE_SIGNED_URL_EXPIRY: 10,
  }
};

export const Swagger = {
  Title: 'Pusher POC',
  Description: 'A Documentation for Nest.js Boilerplate APIs',
  Version: '1.0',
  AddApiKey: {
    Type: 'apiKey',
    Name: 'Authorization',
    In: 'header',
  },
  AuthType: 'basic',
  Path: 'swagger',
};


