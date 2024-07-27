const User = require('../Models/user');
const Admin = require('../Models/user');
const userController = {};

userController.saveUser = async (id, socketId, newReceiver, role, name, profileUrl) => {
  let user = await User.findOne({ id }); // 이미 있는 유저인지 확인

  if (!user) {
    // 없다면 새로 유저정보 만들기
    user = new User({
      id,
      name,
      profile: profileUrl,
      receiver: [newReceiver],
      role,
      token: socketId,
      online: true,
    });
  } else {
    // 이미 있는 유저라면 연결정보 update
    if (!user.receiver.includes(newReceiver)) {
      user.receiver = [...user.receiver, newReceiver];
    }
    user.nmae = name;
    user.profile = profileUrl;
    user.role = role;
    user.token = socketId;
    user.online = true;
  }

  await user.save();
  return user;
};

userController.checkUser = async (socketId) => {
  // socketId로 유저를 찾는 메소드
  const user = await User.findOne({ token: socketId });
  if (!user) throw new Error('user not found');
  return user;
};

module.exports = userController;
