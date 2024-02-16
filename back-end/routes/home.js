// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const {validationResult } = require('express-validator');
const validPassword = require('../config/passwordUtils').validPassword;
const genPassword = require('../config/passwordUtils').genPassword;
const sharp = require('sharp');
// Import models and middleware
const { User, Message, Conversation } = require("../models/databaseSchema");
const { checkId, checkContent,checkUsername, checkEmail, checkPassword }= require('../middleware/validationcheck');
const upload = require('../middleware/multerStorage');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

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

//Function to sendMessage
const sendMessage = async (req, res, next) => {
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
}

//Function to getMessage
const getMessage = async (req, res, next) => {

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
  
  // console.log("getMessages: ", (conversations?.length > 0) ? true : false)
  // console.log("getMessages: ", (conversations[0]?.messages?.length > 0) ? true : false)
  // console.log("getMessages: ", (conversations[0]))
  // console.log("getMessages: ", (conversations[0]?.messages))
    if(conversations?.length > 0){
    const messages = conversations[0].messages
    // Return the conversations directly
    return res.status(200).json({messages});
  }else{
    return res.status(404).json({ message: 'Conversation not found' });
  }

  if(!conversations){
    return res.status(404);
  }
  
} catch (error) {
  next(error);
}
}

//Function to getProfile
const getProfile =  async (req, res, next) => {
  try { 
    // const userId = req.query.userId;
    const userId = req.user.id;
    console.log("find csrf token ", req)

    const user = await User.findOne({ 
      _id:userId
    },'_id displayName email image');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ authenticated: true, user });
  } catch(err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

//Function to getAllConversations
const getAllConversations = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("berrors ",  errors.array()[0])
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
     console.log("getconvs: ", result)

    if(result?.length > 0){
      return res.status(200).json({user: result});
    }else{
      return res.status(200).json({ message: 'no conversation found', user: result });
    }

    if(!result){
      return res.status(404);
    }

    // Return the other participants' details and the number of unread messages
    
  } catch (error) {
    next(error);
  }
}

//Function to getSpecificConversation
const getSpecificConversation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("berrors ",  errors.array()[0])
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
}

//Function to deleteMessageForOne
const deleteMessageForOne = async (req, res, next) => {
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

    const {acknowledged, modifiedCount, matchedCount} = updatedConversation
    if (acknowledged && modifiedCount && matchedCount) {
      return res.status(200).json({ message: 'Message deleted' });
  } else if (acknowledged && matchedCount && !modifiedCount) {
      return res.status(200).json({ message: 'Message not found/deleted' });
  } else {
      return res.status(404).json({ error: 'Conversation not found.' });
  }
  } catch (error) {
    next(error);
  }
};


//Function to updateReadMessages
const updateReadMessages = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, otherUserId} = req.body;

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
    const {acknowledged, modifiedCount, matchedCount} = updatedConversation
    if (acknowledged && modifiedCount && matchedCount) {
      return res.status(200).json({ message: 'messages read' });
  } else if (acknowledged && matchedCount && !modifiedCount) {
      return res.status(200).json({ message: 'No new message' });
  } else {
      return res.status(404).json({ error: 'Conversation not found.' });
  }
  } catch(err){
    console.error("Encountered error updating conversations: ", err);
    res.status(500).json({ error: 'An error occurred while updating the conversation' });
  }
}

//Function to searchUsers
const searchUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { searchQuery } = req.query;
  const userId = req.user.id;
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
}

//Function to deleteConversationForOne
const deleteConversationForOne = async (req, res, next) => {
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
    const {acknowledged, modifiedCount, matchedCount} = updatedConversation
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

//Function to logout
const logout = (req, res, next) => {
  req.logout((error) => {
    if (error) { return next(error); }
    req.session.destroy((err) => {
      if (err) { return next(err); }
      res.clearCookie('connect.sid', { path: '/' });
      res.status(200).json({ message: 'Logged out successfully' }); // Send a response with 200 OK status
    });
  });
}

//Function to updateUserPassword
const updateUserPassword = async (req, res, next) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract fields from request body
  const { userId, oldPassword, newPassword } = req.body;

  try {
    // Find user by ID
    const user = await User.findOne({ _id: userId });

    // If user not found, return error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if old password is valid
    const isValid = validPassword(oldPassword, user.hash, user.salt);

    // If old password is valid, update password
    if(isValid){
      // Generate new salt and hash
      const saltHash = genPassword(newPassword);

      // Update user's salt and hash
      user.hash = saltHash.hash;
      user.salt = saltHash.salt;

      // Save the updated user
      await user.save();
    return res.status(200).json({ message: 'Password updated.' });
    } else {
      // If old password is not valid, return error
      return res.status(400).json({ error: 'Incorrect old password.' });
    }
  } catch (error) {
    // If an error occurred, pass it to the next middleware
    next(error);
  }
}


//Function to updateUserInfo
const updateUserInfo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, email, uname } = req.body;

  try {
    const emailExists = await User.findOne({ email: email });
    if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(400).json({ error: "User with this email already exists" });
    }
    const displayNameExists = await User.findOne({ displayName: uname });
    if (displayNameExists && displayNameExists._id.toString()  !== userId) {
        return res.status(400).json({ error: "User with this name already exists" });
    }

    const updateUser = await User.findOneAndUpdate(
      { _id: userId }, // find a document with that filter
      { displayName: uname , email: email }, // document to insert when nothing was found
      { new: true}, // options
    
    );
    console.log(updateUser);
    if (!updateUser) {
      return res.status(404).json({ error: 'Failed to update user .' });    
    }

    res.status(200).json({
      message: 'User updated',
      updateUser
    });

  } catch (error) {
    next(error);
  }
}

//Function to updateUserInfo

const updateUserImage = async (req, res,next) => {checkUsername, checkEmail, checkPassword
  if (!req.file) {
    return res.status(400).json({ error: 'No file attached' });
  }
  // console.log(req.file.path)
  // req.file is the 'image' file
  // req.body will hold the text fields, if there were any
const tempFilePath = req.file.path + '.tmp';
  try{

      await sharp(req.file.path)
        .resize(500, 500) // replace with your desired dimensions
        .toFile(tempFilePath);

        fs.renameSync(tempFilePath, req.file.path); 
    
  const { userId } = req.body;
  console.log("logging userId : ",userId)
  // Get the user
  const user = await User.findOne({ _id: userId }); // replace with actual user ID
  console.log("logging user : ",user)

  // Delete the old image
  if (user?.image) {
    if (fs.existsSync(user?.image)) {
      fs.unlink(user?.image, (err) => {
        if (err) {
          console.error(err);
          throw err;
        }
        console.log('File deleted successfully');
      });
    } else {
      console.log('No file found to delete');
    }
  }

  // Update the user's image path
  user.image = req.file.path;
  console.log("logging imahepath : ",req.file.path)

  await user.save();

  return res.status(200).json({message:'Image uploaded!', image: req.file.path});
}catch (error) {
  // If an error occurred, pass it to the next middleware
  next(error);
}} 


//================================================ Delete a conversation for one participant================================================
router.delete('/deleteConversationForOne',  [checkId('userId'), checkId('otherUserId')], deleteConversationForOne)

// The main route handler
router.post('/sendMessage', [checkId('senderId'), checkId('receiverId'),checkContent('content')], sendMessage );

//=================================get messages==========================================================================
router.get('/getMessages', [checkId('userId'), checkId('otherUserId')], getMessage );

//=================================get user==========================================================================
router.get("/getProfile",getProfile);


//=================================get user chatlist / convos==========================================================================
router.get('/getAllConversations', [checkId('userId')], getAllConversations);

//===================
router.get('/getSpecificConversation', [checkId('userId'), checkId('otherUserId')], getSpecificConversation);

//================================================ Delete a message for one participant================================================
router.delete('/deleteMessageForOne',[ checkId('userId'), checkId('otherUserId'), checkId('messageId')],deleteMessageForOne );

//================================================
//================================================ Delete a conversation for one participant================================================
router.put('/updateReadMessages',  [checkId('userId'), checkId('otherUserId')],updateReadMessages );

//====================seacrch================
router.get('/searchUsers', [checkContent('searchQuery')], searchUsers );

router.put('/updateUserInfo',[...checkUsername(), checkEmail(), ...checkPassword()],updateUserInfo)
router.put('/updateUserImage',upload.single('image'),updateUserImage)

router.put('/updateUserPassword',[ ...checkPassword('oldPassword'), ...checkPassword('newPassword')],updateUserPassword)

router.get('/logout', logout);



router.use(handleError);
module.exports = router;


