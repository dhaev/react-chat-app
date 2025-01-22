const { User } = require("../models/databaseSchema");
const { validationResult } = require('express-validator');
const createNewMessage = require('../api/createNewMessage');
const addToContacts = require('./addToContacts');

const sendMessage = async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0] });
  }

  const { receiverId, content } = req.body;
  // Check if users exist
  const senderId = req.user.id
  const receiver = await User.findById(receiverId);

  if (!receiver) {
    return res.status(404).json({ message: 'user not found' });
  }

  try {
    // Create a new message
    const newMessage = createNewMessage(senderId, receiverId, content);
    // Find or create the conversation to add the message to
    const conversation = await findOrCreateConversation(senderId, receiverId, newMessage);
    // Update the contacts list for both the sender and the receiver
    await addToContacts(senderId, receiverId);
    await addToContacts(receiverId, senderId);

    // Send a success response
    res.status(200).json({ message: 'Message sent successfully', newMessage });
  } catch (error) {
    // Pass any errors to the next middleware
    next(error);
  }
}

module.exports = sendMessage;