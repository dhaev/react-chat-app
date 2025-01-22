const mongoose = require('mongoose');
const { User, Conversation } = require("../models/databaseSchema");
const { validationResult } = require('express-validator');

const getConversation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0] });
  }

  const userId = new mongoose.Types.ObjectId(req.user.id);
  const otherUserId = new mongoose.Types.ObjectId(req.query.otherUserId);
  try {

    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'user not found' });
    }
    const result = await Conversation.aggregate([
      // Match the conversations that include both users
      { $match: { participants: { $all: [userId, otherUserId] } } },
      // Lookup the other participants' details
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participantDetails'
        }
      },
      // Get the first participantDetails
      {
        $project: {
          participantDetails: { $arrayElemAt: ["$participantDetails", 0] },
          unreadMessages: { $arrayElemAt: ["$unreadMessages", 0] },
        }
      },
      // Group by the other participant's details and count the unread messages
      {
        $group: {
          _id: "$participantDetails._id",
          displayName: { $first: "$participantDetails.displayName" },
          image: { $first: "$participantDetails.image" },
          unreadCount: { $first: "$unreadMessages.count" }
        }
      }
    ]);
    if (!result.length) {

      return res.status(404).json({ message: 'No conversations found' });
    }

    // Return the other participants' details and the number of unread messages
    return res.status(200).json(result);
  } catch (error) {

    res.status(500).json({ message: 'Server Error' });
  }
}

module.exports = getConversation;