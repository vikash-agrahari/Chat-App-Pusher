import { Injectable } from '@nestjs/common';
import { RESPONSE_DATA } from 'src/common/responses';
import { GuardService } from 'src/guards/guards.service';
import { PusherService } from 'src/providers/pusher/pusher.service';
import { ChatEntity } from 'src/entity/chat.entitiy';
import {
  ChannelAuthDto,
  CreateChatDto,
  GetChatDto,
  GroupMembersListDto,
  LeaveGroupQueryDto,
  ManageGroupMembersDto,
  MemberDto,
} from './dto/chat.dto';
import { SessionData } from 'src/interfaces/globle.interface';
import { Types } from 'mongoose';
import { MessageEntity } from 'src/entity/message.entity';
import { Chat, Members } from './interfaces/chat.interface';
import { ENUM } from 'src/common/enum';
import { UserEntity } from 'src/entity/user.entity';
import { User } from '../on-boarding/interfaces/on-boarding.interface';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatEntity: ChatEntity,
    private readonly messageEntity: MessageEntity,
    private readonly pusherService: PusherService,
    private readonly userEntity: UserEntity,
  ) {}

  async createChat(data: CreateChatDto, sessionData: SessionData) {
    try {
      const { isGroup } = data;
      const userData: Members = {
        _id: new Types.ObjectId(sessionData.userId),
        username: sessionData.userData.username,
        profileImage: sessionData.userData.profileImage,
      };
      if (isGroup) {
        userData.isAdmin = true;
      }
      data.members = [...data.members, userData];
      let chat;
      if (!isGroup) {
        chat = await this.chatEntity.isChatExist(data);
        if (chat) return [RESPONSE_DATA.SUCCESS, chat];
      }
      chat = await this.chatEntity.createChat(data);
      return [RESPONSE_DATA.SUCCESS, chat];
    } catch (error) {
      console.log('Error in createChat:---------->', error);
      return [RESPONSE_DATA.ERROR, {}];
    }
  }

  async getChat(data: GetChatDto, userId: string) {
    try {
      const chats = await this.chatEntity.chatList(data, userId);
      return [RESPONSE_DATA.SUCCESS, chats];
    } catch (error) {
      console.log('Error in get chat listing:---------->', error);
      return [RESPONSE_DATA.ERROR, {}];
    }
  }

  async manageGroupMembers(data: ManageGroupMembersDto, userId: string) {
    try {
      // Fetch chat and validate its existence
      const chat = await this.chatEntity.findOne({
        _id: data?.chatId,
        isGroup: true,
      });
      if (!chat) return [RESPONSE_DATA.CHAT_NOT_FOUND, {}];

      // Validate if the user is an admin
      const currentUser = chat.members.find(
        (member: Members) => member._id.toString() === userId,
      );
      if (!currentUser) return [RESPONSE_DATA.NOT_CHAT_MEMBER, {}];
      if (!currentUser.isAdmin) return [RESPONSE_DATA.NOT_ADMIN, {}];

      // Handle adding new members
      if (data?.action === ENUM.GROUP_MEMBER_ACTION.ADD) {
        await this.handleAddMembers(data, chat);
      }

      // Handle removing members
      if (data?.action === ENUM.GROUP_MEMBER_ACTION.REMOVE) {
        await this.handleRemoveMembers(data, chat);
      }

      return [RESPONSE_DATA.SUCCESS, {}];
    } catch (error) {
      console.error('Error in manageGroupMembers:', error);
      return [RESPONSE_DATA.ERROR, {}];
    }
  }

  async groupMembersListing(data: GroupMembersListDto, userId: string) {
    try {
      const chat = await this.chatEntity.findOne({
        _id: data?.chatId,
        isGroup: true,
      });
      if (!chat) return [RESPONSE_DATA.CHAT_NOT_FOUND, {}];

      // Validate if the user is an admin
      const currentUser = chat.members.find(
        (member: Members) => member._id.toString() === userId,
      );
      if (!currentUser) return [RESPONSE_DATA.NOT_CHAT_MEMBER, {}];

      let membersList = await this.chatEntity.groupMembersList(data);

      if (membersList.result?.length) {
        membersList.result = membersList.result.map((member: Members) => {
          if (member._id.toString() === userId) {
            return {
              ...member,
              username: 'You',
            };
          }
          return member;
        });
      }

      return [RESPONSE_DATA.SUCCESS, membersList];
    } catch (error) {
      console.log('Error in groupMembersListing:---------->', error);
      return [RESPONSE_DATA.ERROR, {}];
    }
  }

  async authorizeChannel(data: ChannelAuthDto, sessionData: SessionData) {
    try {
      const socketId = data.socketId;
      const channel = data.channelName;
      const presenceData = {
        user_id: sessionData.userId,
        user_info: {
          username: sessionData.userData.username,
          email: sessionData.userData.email,
        },
      };
      const auth = this.pusherService.pusher.authorizeChannel(
        socketId,
        channel,
        presenceData,
      );
      return [RESPONSE_DATA.SUCCESS, auth];
    } catch (error) {
      console.log('Error in authorizeChannel:---------->', error);
      return [RESPONSE_DATA.ERROR, {}];
    }
  }

  // async leaveChatGroup(data: LeaveGroupQueryDto, sessionData: SessionData) {
  //   try {
  //     // Fetch chat and validate its existence
  //     const chat: Chat = await this.chatEntity.findOne({
  //       _id: data?.chatId,
  //     });
  //     if (!chat) return [RESPONSE_DATA.CHAT_NOT_FOUND, {}];

  //     if(chat?.isGroup){
  //       await this.chatEntity.updateOne(
  //         { _id: data.chatId },
  //         {
  //           $pull: {
  //             members: {
  //               _id: new Types.ObjectId(sessionData?.userId),
  //             },
  //           },
  //         },
  //       );
  
  //       return [RESPONSE_DATA.GROUP_LEFT(chat?.name || 'this group.'), {}];
  //     }else{
      
  //     }
  //   } catch (error) {
  //     console.log('Error in leaveChatGroup:---------->', error);
  //     return [RESPONSE_DATA.ERROR, {}];
  //   }
  // }

  private async handleAddMembers(data: ManageGroupMembersDto, chat: Chat) {
    const newMemberIds = data.members.map(
      (member: Members) => new Types.ObjectId(member._id),
    );

    // Query for existing users and build a set of their IDs
    const existingUsers = await this.userEntity.findAll({
      _id: { $in: newMemberIds },
    });
    const existingUserIds = new Set(
      existingUsers.map((user: User) => user._id.toString()),
    );

    // Filter and add unique new members
    const newUniqueMembers = data.members.filter(
      (member: Members) =>
        existingUserIds.has(member._id.toString()) &&
        !chat.members.some(
          (existingMember: Members) =>
            existingMember._id.toString() === member._id.toString(),
        ),
    );

    if (newUniqueMembers.length > 0) {
      await this.chatEntity.updateOne(
        { _id: data.chatId },
        { $push: { members: { $each: newUniqueMembers } } },
      );
    }
  }

  private async handleRemoveMembers(data: ManageGroupMembersDto, chat: Chat) {
    const removeMemberIds = data.members.map((member) => member._id.toString());

    if (removeMemberIds.length > 0) {
      await this.chatEntity.updateOne(
        { _id: data.chatId },
        {
          $pull: {
            members: {
              _id: { $in: removeMemberIds.map((id) => new Types.ObjectId(id)) },
            },
          },
        },
      );
    }
  }
}
