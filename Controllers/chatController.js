const mongoose = require('mongoose');
const Chat = require('../Models/chat');
const chatController = {};

// 유저 -> 글 작성자 채팅 저장
chatController.saveChat = async (id, newMessage, user) => {
  console.log(id, user);
  let chat = await Chat.findOne({ $and: [{ id: id }, { 'user.id': user.id }] });
  console.log(`chat founded? : ${chat}`);

  if (!chat) {
    // 채팅이 존재하지 않으면 새로 생성
    chat = new Chat({
      id,
      message: [newMessage],
      sender: user.role,
      user: {
        id: user.id,
        name: user.name,
        profile: user.profile,
      },
    });
  } else {
    // 채팅이 존재하면 메시지 배열에 새 메시지 추가
    chat.message.push(newMessage);
    chat.sender.push(user.role);
    chat.user.name = user.name;
    chat.user.profile = user.profile;
  }

  await chat.save();
  return chat;
};

// 글 작성자 -> 유저 채팅 저장
chatController.saveChatAdmin = async (id, newMessage, senderId) => {
  let chat = await Chat.findOne({ $and: [{ id: id }, { 'user.id': senderId }] });

  if (!chat) {
    return null;
  } else {
    // 채팅이 존재하면 메시지 배열에 새 메시지 추가
    chat.message.push(newMessage);
    chat.sender.push('admin');
    // chat.user.name = user.name;
  }

  await chat.save();
  return chat;
};

// 이전 채팅 기록 불러오기
chatController.loadChat = async (id, userId) => {
  let chat = await Chat.findOne({ $and: [{ id: id }, { 'user.id': userId }] });

  if (!chat) {
    return null;
  } else {
    try {
      // 채팅 정보를 id로 조회
      const chat = await Chat.findOne({ $and: [{ id: id }, { 'user.id': userId }] }).exec();
      return chat;
    } catch (error) {
      console.error('채팅 조회 중 오류 발생:', error.message);
      throw error;
    }
  }
};

// 한 체험의 모든 채팅 목록 불러오기
chatController.chatRoomList = async (id) => {
  let room = await Chat.find({ id });

  if (!room) {
    return null;
  } else {
    try {
      const room = await Chat.find({ id }).exec();
      return room;
    } catch (error) {
      console.error('채팅방 조회 중 오류 발생:', error.message);
      throw error;
    }
  }
};

module.exports = chatController;
