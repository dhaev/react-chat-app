const mongoose = require('mongoose');
const { User, Conversation } = require("../models/databaseSchema");
const { validationResult } = require('express-validator');

const getChatMessages = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0] });
  }
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const otherUserId = new mongoose.Types.ObjectId(req.query.otherUserId);

  try {

    // Check if users exist
    const otherUser = await User.findById(otherUserId);

    if (!otherUser) {
      return res.status(404).json({ message: 'user not found' });
    }
    const conversations = await Conversation.aggregate([
      // Match the conversation between the logged in user and the other user
      { $match: { participants: { $all: [userId, otherUserId] } } },
      // Add a new field 'filteredMessages' which contains only the messages that include the logged in user
      {
        $addFields: {
          filteredMessages: {
            $filter: {
              input: "$messages",
              as: "message",
              cond: { $in: [userId, "$$message.include"] }
            }
          }
        }
      },
      // Only include the 'filteredMessages' field in the output documents
      { $project: { messages: "$filteredMessages" } }
    ]);

    let messages
    if (conversations?.length > 0) {
      messages = conversations[0].messages
      // Return the conversations directly
      return res.status(200).json({ messages });
    } else {
      return res.status(200).json({ message: 'Conversation not found', messages: [] });
    }

  } catch (error) {
    next(error);
  }
}

module.exports = getChatMessages