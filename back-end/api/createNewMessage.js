const mongoose = require('mongoose');
const { Message } = require("../models/databaseSchema");

const createNewMessage = (senderId, receiverId, content) => {
    return new Message({
      _id: new mongoose.Types.ObjectId(),
      sender: senderId,
      receiver: receiverId,
      content: content,
      include: [senderId, receiverId] // Add the sender and receiver to the 'include' array
    });
  };

module.exports = createNewMessage;