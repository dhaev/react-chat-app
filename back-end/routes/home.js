// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const {validationResult } = require('express-validator');

// Import models and middleware
const { User, Message, Conversation } = require("../models/user");
const { checkId, checkContent,checkUsername }= require('../middleware/validationcheck');

// Initialize router
const router = express.Router();

// Middleware for error handling
const handleError = (err, req, res, next) => {
  console.error(err);
  res.status(500).send('Server error');
};


const createNewMessage = (senderId, receiverId, content) => {
  // Create a new message with the provided sender ID, receiver ID, and content
  return new Message({
    _id: new mongoose.Types.ObjectId(),
    sender: senderId,
    receiver: receiverId,
    content: content,
    include: [senderId, receiverId] // Add the sender and receiver to the 'include' array
  });
};


// Function to find or create a conversation
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


// Function to update a user's contacts
const updateUserContacts = async (userId, contactId) => {
  // Add the contact ID to the user's list of contacts
  return await User.updateOne(
    { _id: userId },
    { $addToSet: { contacts: contactId } }
  );
};

// The main route handler
router.post('/sendMessage', [checkId('senderId'), checkId('receiverId'),checkContent()], async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0] });
  }

  const {senderId, receiverId, content } = req.body;
      // Check if users exist
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);
      console.log(receiver)
      if (!sender || !receiver) {
        return res.status(404).json({ message: 'user not found' });
      }

  try {
    // Create a new message
    const newMessage = createNewMessage(senderId, receiverId, content);
    // Find or create the conversation to add the message to
    const conversation = await findOrCreateConversation(senderId, receiverId, newMessage);
    // Update the contacts list for both the sender and the receiver
    await updateUserContacts(senderId, receiverId);
    await updateUserContacts(receiverId, senderId);

    // Send a success response
    res.status(200).json({ message: 'Message sent successfully', newMessage });
  } catch (error) {
    // Pass any errors to the next middleware
    next(error);
  }
});

//=================================get messages==========================================================================
router.get('/getMessages', [checkId('userId'), checkId('otherUserId')], async (req, res, next) => {

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0] });
    }
  const userId = new mongoose.Types.ObjectId(req.query.userId);
  const otherUserId = new mongoose.Types.ObjectId(req.query.otherUserId) ;

  try {

        // Check if users exist
        const user = await User.findById(userId);
        const otherUser = await User.findById(otherUserId);
    
        if (!user || !otherUser ) {
          return res.status(404).json({ message: 'user not found' });
        }
    const conversations = await Conversation.aggregate([
      // Match the conversation between the logged in user and the other user
      { $match: { participants: { $all: [userId, otherUserId] } } },
      // Add a new field 'filteredMessages' which contains only the messages that include the logged in user
      { $addFields: {
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
    
    if(conversations.length > 0){
      const messages = conversations[0].messages
      // Return the conversations directly
      return res.status(200).json({messages});
    }else{
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
  } catch (error) {
    next(error);
  }
});

//=================================get user==========================================================================
router.get("/getProfile",  async (req, res, next) => {
  try { 
    const userId = req.user.id;
    console.log("find csrf token "+ req)

    const user = await User.findOne({ 
      _id:userId
    },'_id displayName email image');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ authenticated: true, user });
  } catch(err) {
    console.error("Encountered error getting user:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//=================================get user chatlist / convos==========================================================================
router.get('/getAllConversations', [checkId('userId')]
, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("berrors "+  errors.array()[0])
    return res.status(400).json({ error: errors.array()[0] });
  }

  
  const userId = new mongoose.Types.ObjectId(req.query.userId);
  try {
    const user = await User.findById(userId);
    if (!user ) {
      return res.status(404).json({ message: 'user not found' });
    }
    const result = await Conversation.aggregate([
      // Match the conversations that include the user
      { $match: { participants: userId } },
      // Exclude the user from the participants
      { $project: {
          participants: {
            $filter: {
              input: "$participants",
              as: "participant",
              cond: { $ne: ["$$participant", userId] }
            }
          },
          unreadMessages: {
            $filter: {
              input: "$unreadMessages",
              as: "message",
              cond: { $eq: ["$$message.user", userId] }
            }
          }
        }
      },
      // Lookup the other participants' details
      { $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participantDetails'
        }
      },
      // Get the first participantDetails
      { $project: {
          participantDetails: { $arrayElemAt: ["$participantDetails", 0] },
          unreadMessages: { $arrayElemAt: ["$unreadMessages", 0] },
        }
      },
      // Group by the other participant's details and count the unread messages
      { $group: {
          _id: "$participantDetails._id",
          displayName: { $first: "$participantDetails.displayName" },
          image: { $first: "$participantDetails.image" },
          unreadCount: { $first: "$unreadMessages.count" }
        }
      }
    ]);

    if (!result.length) {

      return res.status(404).json({ message: 'No conversations found'});
    }

    // Return the other participants' details and the number of unread messages
    return res.status(200).json({user: result});
  } catch (error) {
    next(error);
  }
});

//===================
router.get('/getSpecificConversation', [checkId('userId'), checkId('otherUserId')], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("berrors "+  errors.array()[0])
    return res.status(400).json({ error: errors.array()[0] });
  }

  const userId = new mongoose.Types.ObjectId(req.query.userId);
  const otherUserId = new mongoose.Types.ObjectId(req.query.otherUserId);
  try {
    const user = await User.findById(userId);
    const otherUser = await User.findById(otherUserId);
    if (!user || !otherUser) {
      return res.status(404).json({ message: 'user not found' });
    }
    const result = await Conversation.aggregate([
      // Match the conversations that include both users
      { $match: { participants: { $all: [userId, otherUserId] } } },
      // Lookup the other participants' details
      { $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participantDetails'
        }
      },
      // Get the first participantDetails
      { $project: {
          participantDetails: { $arrayElemAt: ["$participantDetails", 0] },
          unreadMessages: { $arrayElemAt: ["$unreadMessages", 0] },
        }
      },
      // Group by the other participant's details and count the unread messages
      { $group: {
          _id: "$participantDetails._id",
          displayName: { $first: "$participantDetails.displayName" },
          image: { $first: "$participantDetails.image" },
          unreadCount: { $first: "$unreadMessages.count" }
        }
      }
    ]);
    if (!result.length) {

      return res.status(404).json({ message: 'No conversations found'});
    }

    // Return the other participants' details and the number of unread messages
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

//================================================ Delete a message for one participant================================================
router.delete('/deleteMessageForOne',[ checkId('userId'), checkId('otherUserId'), checkId('messageId')], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, otherUserId, messageId } = req.body;

  try {
    const user = await User.findById(userId);
    const otherUser = await User.findById(otherUserId);

    if (!user || !otherUser ) {
      return res.status(404).json({ message: 'user not found' });
    }
    const updatedConversation = await Conversation.updateOne({
      participants: { $all: [userId, otherUserId] }
    }, {
      $pull: { 'messages.$[elem].include': userId }
    }, {
      arrayFilters: [{ 'elem._id': messageId}]
    });

    if (!updatedConversation) {
      return res.status(404).json({ error: 'Conversation or message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
});

//================================================ Delete a conversation for one participant================================================
router.delete('/deleteConversationForOne',  [checkId('userId'), checkId('otherUserId')], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, otherUserId, messageId } = req.body;

  try {
    const user = await User.findById(userId);
    const otherUser = await User.findById(otherUserId);

    if (!user || !otherUser ) {
      return res.status(404).json({ message: 'user not found' });
    }
    const updatedConversation = await Conversation.updateMany({
      participants: { $all: [userId, otherUserId] }
    }, {
      $pull: { 'messages.$[].include': userId }
    });
    console.log(updatedConversation);
    if (!updatedConversation.modifiedCount) {
      return res.status(404).json({ error: 'Conversation not found. Please check the participants.' });
    }

    return res.status(200).json({ message: 'User removed from conversation successfully.' });
  } catch (error) {
    next(error);
  }
});

//================================================
//================================================ Delete a conversation for one participant================================================
router.put('/updateReadMessages',  [checkId('userId'), checkId('otherUserId')], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, otherUserId, messageId } = req.body;

  try {
    const user = await User.findById(userId);
    const otherUser = await User.findById(otherUserId);

    if (!user || !otherUser ) {
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
    console.log(updatedConversation);
    if (!updatedConversation.modifiedCount) {
      return res.status(404).json({ error: 'Conversation not found. Please check the participants.' });
    }

    res.json({
      message: 'Conversation updated successfully',
      updatedConversation
    });
  } catch(err){
    console.error("Encountered error updating conversations: ", err);
    res.status(500).json({ error: 'An error occurred while updating the conversation' });
  }
});

//====================seacrch================
router.get('/searchUsers', [...checkUsername()],  async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { searchQuery } = req.query;
  const userId = req.user.id;
  // try {
  //   const users = await User.find({ 
  //     $text: { $search: searchQuery },
  //     _id: { $ne: userId }
  //   }, 
  //   // Projection
  //   { 
  //     score: { $meta: "textScore" },
  //     _id: 1,
  //     displayName: 1,
  //     image: 1
  //   })
  //   .sort({ score: { $meta: "textScore" } })
  //   .limit(5);

  try {
    const users = await User.find({ 
      displayName: { $regex: new RegExp(searchQuery, 'i') }, // replace 'name' with the field you want to search
      _id: { $ne: userId }
    }, 
    // Projection
    { 
      _id: 1,
      displayName: 1,
      image: 1
    })
    .limit(5);

    res.status(200).json(users);
  } catch (err) {
    console.error("Encountered error updating conversations: ", err);
    res.status(500).json({ error: 'An error occurred while searching for user' });
  }
});

router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {return next(error); }
    req.session.destroy((err) => {
      if (err) {return next(err); }
      res.clearCookie('connect.sid', { path: '/' });
    });
  });
});


router.use(handleError);
module.exports = router;