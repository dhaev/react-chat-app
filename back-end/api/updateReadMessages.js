const { User, Conversation } = require("../models/databaseSchema");
const {validationResult } = require('express-validator');

const updateReadMessages = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const {otherUserId} = req.body;
    const userId = req.user.id;
  
    try {
      const otherUser = await User.findById(otherUserId);
  
      if ( !otherUser ) {
        return res.status(404).json({ message: 'user not found' });
      }
      const updatedConversation = await Conversation.updateMany({
        participants: { $all: [userId, otherUserId] },
        messages: { $elemMatch: { receiver: userId } }
      }, {
        $set: { 'messages.readByReceiver': true },
        $set: { 'unreadMessages.$[elem].count': 0 }
      }, {
        arrayFilters: [{ 'elem.user': userId }],
        new: true
      });
  
      const {acknowledged, modifiedCount, matchedCount} = updatedConversation
      if (acknowledged && modifiedCount && matchedCount) {
        return res.status(200).json({ message: 'messages read' });
    } else if (acknowledged && matchedCount && !modifiedCount) {
        return res.status(200).json({ message: 'No new message' });
    } else {
        return res.status(404).json({ error: 'Conversation not found.' });
    }
    } catch(err){
      res.status(500).json({ error: 'An error occurred while updating the conversation' });
    }
  }
  
module.exports = updateReadMessages;