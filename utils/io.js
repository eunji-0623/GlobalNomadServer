// 웹 소켓(통신)과 관련된 코드 모음
const userController = require('../Controllers/userController');
const chatController = require('../Controllers/chatController');
const { now } = require('mongoose');

module.exports = function (io) {
  io.on('connection', async (socket) => {
    console.log('client is connected', socket.id, now());
    // 문의 버튼 눌렀을 때, 이용자 -> 글 작성자
    socket.on('inquiry', async (id, receiver, activityId, name, profileUrl, callBack) => {
      // user 정보 체크
      try {
        const user = await userController.saveUser(id, socket.id, receiver, 'user', name, profileUrl);
        callBack({ ok: true, data: user });
      } catch (error) {
        callBack({ ok: false, data: error.message });
      }

      // 이전 대화 기록 불러오기
      try {
        const prevMessage = await chatController.loadChat(activityId, id);
        io.emit('prevMessage', prevMessage);
        callBack({ ok: true });
      } catch (error) {
        callBack({ ok: false, data: error.message });
      }
    });

    // 메세지 보냈을 때 (이용자 -> 글 작성자)
    socket.on('sendMessage', async (id, message, callBack) => {
      try {
        // 유저 찾아서 메세지 저장
        const user = await userController.checkUser(socket.id);
        const newMessage = await chatController.saveChat(id, message, user);
        io.emit('message', newMessage);
        callBack({ ok: true, data: newMessage });
      } catch (error) {
        callBack({ ok: false, data: error.message });
      }
    });

    // 문의 내역 눌렀을 때, 글 작성자 -> 이용자
    socket.on('inquiryList', async (activityId) => {
      try {
        // room 목록 체크
        const roomList = await chatController.chatRoomList(activityId);
        io.emit('roomList', roomList);
      } catch (error) {
        callBack({ ok: false, data: error.message });
      }

      // 채팅방 선택했을 때, 글 작성자 -> 이용자
      socket.on('inquiryAdmin', async (id, activityId, senderId, callBack) => {
        // user 정보 체크
        try {
          const user = await userController.saveUser(id, socket.id, 0, 'admin');
          callBack({ ok: true, data: user });
        } catch (error) {
          callBack({ ok: false, data: error.message });
        }
        // 이전 대화 기록 불러오기
        try {
          const prevMessage = await chatController.loadChat(activityId, senderId);
          io.emit('prevMessage', prevMessage);
          callBack({ ok: true });
        } catch (error) {
          callBack({ ok: false, data: error.message });
        }
      });
    });

    // 메세지 보냈을 때 (글 작성자 -> 이용자)
    const sendMessageAdminHandler = async (activityId, message, senderId, callBack) => {
      try {
        const newMessage = await chatController.saveChatAdmin(activityId, message, senderId);
        io.emit('message', newMessage);
        callBack({ ok: true, data: newMessage });
      } catch (error) {
        callBack({ ok: false, data: error.message });
      }
    };

    socket.on('sendMessageAdmin', sendMessageAdminHandler);

    // 소켓 연결이 끊겼을 때
    socket.on('disconnect', () => {
      console.log('user is disconnected');
    });
  });
};
