/**
 * @file response
 * @description defines response for entity
 */

import { HttpStatus } from '@nestjs/common';

export const RESPONSE_MSG = {
  SUCCESS: 'Success.',
  ERROR: 'Something went wrong.',
  SESSION_EXPIRED: 'Session Expired.',
  USER_NOT_EXIST: 'User does not exists.',
  INVALID_AUTHORIZATION_TOKEN: 'Invalid authorization token.',
  USER_ALREADY_EXIST: 'Entered email is already associated with an account.',
  INVALID_PASSWORD: 'Invalid password.',
  CHAT_NOT_FOUND: 'Chat not found.',
  NOT_CHAT_MEMBER: 'You are not a member of this chat.',
  NOT_ADMIN: 'You are not an admin.',
  GROUP_LEFT: (groupName: string) => {
    return `Left '${groupName}'`;
  },
};

export const RESPONSE_DATA = {
  SUCCESS: {
    statusCode: HttpStatus.OK,
    message: RESPONSE_MSG.SUCCESS,
  },
  ERROR: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: RESPONSE_MSG.ERROR,
  },
  USER_ALREADY_EXIST: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: RESPONSE_MSG.USER_ALREADY_EXIST,
  },
  USER_NOT_EXIST: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: RESPONSE_MSG.USER_NOT_EXIST,
  },
  INVALID_PASSWORD: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: RESPONSE_MSG.INVALID_PASSWORD,
  },
  CHAT_NOT_FOUND: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: RESPONSE_MSG.CHAT_NOT_FOUND,
  },
  NOT_CHAT_MEMBER: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: RESPONSE_MSG.NOT_CHAT_MEMBER,
  },
  NOT_ADMIN: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: RESPONSE_MSG.NOT_ADMIN,
  },
  GROUP_LEFT: (groupName: string) => {
    return {
      statusCode: HttpStatus.OK,
      message: RESPONSE_MSG.GROUP_LEFT(groupName),
    };
  },
};
