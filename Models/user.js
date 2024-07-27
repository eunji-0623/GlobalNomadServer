const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  //Schema는 내가 받을 데이터가 이렇게 생겼다~ 라는 정보를 담아둔 설계도라 보면 된다.
  id: {
    type: Number,
    required: [true, 'User must type id'],
    unique: true,
  },
  name: { type: String },
  profile: { type: String },
  receiver: { type: [String] },
  role: { type: String },
  token: { type: String }, // 연결 id 정보
  online: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
