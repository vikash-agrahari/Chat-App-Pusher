import { Injectable, Inject } from '@nestjs/common';
import { Model, PipelineStage, Types } from 'mongoose';
import { Utils } from 'src/common/utils';
import { GetMessageDto, MessageDto } from 'src/modules/message/dto/message.dto';
import { Dao } from 'src/providers/database/dao.provider';
import { IMessage } from 'src/schema/message.schema';

@Injectable()
export class MessageEntity extends Dao {
  constructor(@Inject('MESSAGE_MODEL') private messageModel: Model<IMessage>, private readonly utils: Utils,) {
    super(messageModel);
  }

  async createMessage(payload: MessageDto) {
    const user = await this.saveData(payload);
    return user;
  }

  async getMessages(payload: GetMessageDto) {
    const pipeline: PipelineStage[] = [];
    pipeline.push({
      $match: {
        chatId: new Types.ObjectId(payload.chatId)
      }
    },
      {
        $sort: {
          createdAt: -1
        }
      },
      { $skip: ((payload.page) - 1) * (payload.limit) },
      { $limit: (payload.limit) + 1 },
    )
    const data = await this.aggregateData(pipeline, { allowDiskUse: true })
    const chats = this.utils.formatPaginationResponse(data, payload.limit);
    return chats;
  }

}
