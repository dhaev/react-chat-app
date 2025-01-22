const mongoose = require('mongoose');
const { User, Conversation } = require("../models/databaseSchema");
const { validationResult } = require('express-validator');

const clearChatHistoryForUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { otherUserId } = req.body;
  const userId = req.user.id;

  try {
    const otherUser = await User.findById(otherUserId);

    if (!otherUser) {
      return res.status(404).json({ message: 'user not found' });
    }
    const updatedConversation = await Conversation.updateMany({
      participants: { $all: [userId, otherUserId] }
    }, {
      $pull: { 'messages.$[].include': userId }
    });

    const { acknowledged, modifiedCount, matchedCount } = updatedConversation
    if (acknowledged && modifiedCount && matchedCount) {
      return res.status(200).json({ message: 'Conversation deleted' });
    } else if (acknowledged && matchedCount && !modifiedCount) {
      return res.status(200).json({ message: 'No messages to delete' });
    } else {
      return res.status(404).json({ error: 'Conversation not found.' });
    }

  } catch (error) {
    next(error);
  }
}

module.exports = clearChatHistoryForUser;