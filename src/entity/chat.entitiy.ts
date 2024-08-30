import { Injectable, Inject } from '@nestjs/common';
import { Model, PipelineStage, Types } from 'mongoose';
import { Utils } from 'src/common/utils';
import {
  CreateChatDto,
  GetChatDto,
  GroupMembersListDto,
  MemberDto,
} from 'src/modules/chat/dto/chat.dto';
import { Dao } from 'src/providers/database/dao.provider';
import { IChat } from 'src/schema/chat.schema';

@Injectable()
export class ChatEntity extends Dao {
  constructor(
    @Inject('CHAT_MODEL') private chatModel: Model<IChat>,
    private readonly utils: Utils,
  ) {
    super(chatModel);
  }

  async createChat(payload: CreateChatDto) {
    const user = await this.saveData(payload);
    return user;
  }

  async isChatExist(payload: CreateChatDto) {
    const user = await this.findOne({
      'members._id': { $all: payload.members },
      members: { $size: 2 },
    });
    return user;
  }

  async chatList(payload: GetChatDto, userId: string) {
    const pipeline: PipelineStage[] = [];
    pipeline.push(
      {
        $match: {
          'members._id': new Types.ObjectId(userId),
        },
      },
      {
        $sort: {
          lastMessageAt: -1,
        },
      },
      { $skip: (payload.page - 1) * payload.limit },
      { $limit: payload.limit + 1 },
    );
    if (payload.search) {
      pipeline.push({
        $match: {
          name: { $regex: payload.search, $options: 'si' },
        },
      });
    }
    const data = await this.aggregateData(pipeline, { allowDiskUse: true });
    const chats = this.utils.formatPaginationResponse(data, payload.limit);
    return chats;
  }

  async groupMembersList(payload: GroupMembersListDto) {
    const matchConditions: Record<string, any> = {
      _id: new Types.ObjectId(payload?.chatId),
    };

    // if (payload.search) {
    //   matchConditions.$expr = {
    //     $regexMatch: {
    //       $regex: payload?.search,
    //       $options: "i"
    //     },
    //     $field: "members.username"
    //   };
    // }

    const pipeline: PipelineStage[] = [
      {
        $match: matchConditions,
      },
      {
        $unwind: '$members',
      },
      {
        $match: {
          ...(payload.search
            ? {
                'members.username': { $regex: payload.search, $options: 'i' },
              }
            : {}),
        },
      },
      {
        $project: {
          _id: '$members._id',
          username: '$members.username',
          profileImage: '$members.profileImage',
          isAdmin: '$members.isAdmin',
        },
      },
    ];

    const data = await this.aggregateData(pipeline, { allowDiskUse: true });
    const chats = this.utils.formatPaginationResponse(data, payload.limit);
    return chats;
  }
}
