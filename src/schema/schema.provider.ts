import { Connection } from 'mongoose';
import { userSchema } from './user.schema';
import { chatSchema } from './chat.schema';
import { ENUM } from 'src/common/enum';
import { userSessionSchema } from './user-session.schema';
import { messageSchema } from './message.schema';

export const schemaProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) => connection.model(ENUM.COLLECTIONS.USER, userSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'CHAT_MODEL',
    useFactory: (connection: Connection) => connection.model(ENUM.COLLECTIONS.CHAT, chatSchema),
    inject: ['DATABASE_CONNECTION'],
  },

  {
    provide: 'MESSAGE_MODEL',
    useFactory: (connection: Connection) => connection.model(ENUM.COLLECTIONS.MESSAGE, messageSchema),
    inject: ['DATABASE_CONNECTION'],
  },

  {
    provide: 'USER_SESSION_MODEL',
    useFactory: (connection: Connection) => connection.model(ENUM.COLLECTIONS.USER_SESSION, userSessionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
