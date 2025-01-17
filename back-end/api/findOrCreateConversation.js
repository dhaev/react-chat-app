const { User, Conversation } = require("../models/databaseSchema");
const findOrCreateConversation = require('../api/findOrCreateConversation');

const findOrCreateConversation = async (senderId, receiverId, newMessage) => {
    // Try to find an existing conversation between the sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });
  
    if (!conversation) {
      // If no conversation exists, create a new one
      conversation = new Conversation({
        participants: [senderId, receiverId],
        messages: [newMessage],
        unreadMessages: [{ user: receiverId, count: 1 }]
      });
    } else {
      // If a conversation exists, add the new message to it
      conversation.messages.push(newMessage);
      // Try to increment the count of unread messages for the receiver
      let result = await Conversation.updateOne(
        { "_id": conversation._id, "unreadMessages.user": receiverId },
        { $inc: { "unreadMessages.$.count": 1 } }
      );
      if (result.modifiedCount === 0) {
        // If the count was not incremented, the unreadInfo for the receiver does not exist
        // So, add a new unreadInfo for the receiver
        conversation.unreadMessages.push({ user: receiverId, count: 1 });
      }
    }
  
    // Save the conversation and return it
    return conversation.save();
  };
   
module.exports = findOrCreateConversation;
  