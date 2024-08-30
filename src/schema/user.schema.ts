import { Schema, Types } from 'mongoose';
import { ENUM } from 'src/common/enum';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profileImage: string;
}


export const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },
  },
  {
    versionKey: false,
    timestamps: true,
    collection: ENUM.COLLECTIONS.USER,
  },
);
