const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true }, // activityId
    message: [String],
    sender: [String],
    user: {
      id: { type: Number },
      name: { type: String },
      profile: { type: String },
    },
  },
  { timestamp: true },
);
module.exports = mongoose.model('Chat', chatSchema);
