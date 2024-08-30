import { Schema, Types } from 'mongoose';
import { ENUM } from 'src/common/enum';

export interface IChat extends Document {
    name: string;
    members: []
    isGroup: boolean;
    chatPhoto: string;
    text: string;
    image: string;
    video: string;
    lastMessageAt: Date;
}


export const chatSchema: Schema<IChat> = new Schema<IChat>(
    {
        name: { type: String, default: '' },
        members: [{
            _id: { type: Types.ObjectId },
            username: { type: String, required: true },
            profileImage: { type: String, default: "" },
            isAdmin: {  type: Boolean}
        }],
        isGroup: {
            type: Boolean,
            default: false
        },
        chatPhoto: {
            type: String,
            default: ''
        },
        text: { type: String },
        image: { type: String },
        video: { type: String },
        lastMessageAt: {
            type: Date
        }
    },
    {
        versionKey: false,
        timestamps: true,
        collection: ENUM.COLLECTIONS.CHAT,
    },
);
