import { Mixed, Schema, Types } from 'mongoose';
import { ENUM } from 'src/common/enum';

export interface IUserSession extends Document {
  userId: Mixed;
}

export const userSessionSchema: Schema<IUserSession> = new Schema<IUserSession>(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      unique: true,
      ref: ENUM.COLLECTIONS.USER,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    collection: ENUM.COLLECTIONS.USER_SESSION,
  },
);
