import { ObjectId, Schema, Types } from 'mongoose';
import { ENUM } from 'src/common/enum';

export interface IMessage extends Document {
    _id: ObjectId;
    text: string;
    image: string;
    video: string
    chatId: ObjectId;
    sender: {
        _id: ObjectId,
        username: String,
        profileImage: String,
    };
    seenBy: [{
        _id: ObjectId,
        username: String,
        profileImage: String
    }];
    createdAt: Date;
}


export const messageSchema: Schema<IMessage> = new Schema<IMessage>(
    {
        _id: { type: Schema.Types.ObjectId, required: true, auto: true },
        text: { type: String },
        image: { type: String },
        video: { type: String },
        seenBy: [{
            _id: { type: Types.ObjectId },
            username: { type: String, required: true },
            profileImage: { type: String, default: "" },
        }],
        sender: {
            _id: { type: Types.ObjectId },
            username: { type: String, required: true },
            profileImage: { type: String, default: "" }
        },
        chatId: { type: Types.ObjectId },
        createdAt: {
            type: Date
        }
    },
    {
        versionKey: false,
        timestamps: true,
        collection: ENUM.COLLECTIONS.MESSAGE,
    },
);
