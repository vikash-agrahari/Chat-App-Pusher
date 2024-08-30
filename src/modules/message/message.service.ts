import { Injectable } from '@nestjs/common';
import { RESPONSE_DATA } from 'src/common/responses';
import { PusherService } from 'src/providers/pusher/pusher.service';
import { ChatEntity } from 'src/entity/chat.entitiy';
import { SessionData } from 'src/interfaces/globle.interface';
import { Types } from 'mongoose';
import { MessageEntity } from 'src/entity/message.entity';
import { GetMessageDto, MessageDto } from './dto/message.dto';
import { CONSTANT } from 'src/common/constant';
import { MemberDto } from '../chat/dto/chat.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageEntity: MessageEntity,
    private readonly chatEntity: ChatEntity,
    private readonly pusherService: PusherService,
  ) {}

  async sendMessage(data: MessageDto, sessionData: SessionData) {
    try {
      const payload: any = data;
      payload.createdAt = new Date();
      //   payload._id = new mongoose.Types.ObjectId();
      const userData = {
        _id: new Types.ObjectId(sessionData.userId),
        username: sessionData.userData.username,
        profileImage: sessionData.userData.profileImage,
      };
      payload.seenBy = userData;
      this.pusherService.trigger(
        `private-${payload.chatId}`,
        CONSTANT.PUSHER.EVENTS.NEW_MESSAGE,
        payload,
        payload.socketId,
      );
      this.messageEntity.findOneAndUpdate({ _id: payload._id }, payload, {
        upsert: true,
      });

      const dataToUpdate: any = {
        lastMessageAt: payload.createdAt,
      };
      if (payload.text) dataToUpdate.text = payload.text;
      if (payload.image) dataToUpdate.image = payload.image;
      if (payload.video) dataToUpdate.video = payload.video;
      const updatedChat = await this.chatEntity.findOneAndUpdate(
        { _id: payload.chatId },
        dataToUpdate,
      );

      // Prepare events for trigger message in batches
      const filteredMembers = updatedChat.members.filter(
        (member: MemberDto) => member._id.toString() !== sessionData.userId,
      );

      console.log(filteredMembers);

      const events = filteredMembers.map((member: MemberDto) => ({
        channel: `private-${member._id.toString()}`,
        name: CONSTANT.PUSHER.EVENTS.CHAT_UPDATE,
        data: {
          id: payload.chatId,
          message: payload,
        },
      }));

      //pusher trigger message for each member of chat
      this.pusherService.triggerInBatches(events);

      return [RESPONSE_DATA.SUCCESS, {}];
    } catch (error) {
      console.log('Error in createMessage:---------->', error);
      return [RESPONSE_DATA.ERROR, {}];
    }
  }

  async getMessages(data: GetMessageDto) {
    try {
      const chats = await this.messageEntity.getMessages(data);
      return [RESPONSE_DATA.SUCCESS, chats];
    } catch (error) {
      console.log('Error in get getMessages:---------->', error);
      return [RESPONSE_DATA.ERROR, {}];
    }
  }

  // async hitTrigger(data: any) {
  //     try {
  //         this.pusherService.trigger('Ch', 'MSG', data);
  //         return [RESPONSE_DATA.SUCCESS, {}];
  //     } catch (error) {
  //         console.log('Error in userList:---------->', error);
  //         return [RESPONSE_DATA.ERROR, {}];
  //     }
  // }
}
