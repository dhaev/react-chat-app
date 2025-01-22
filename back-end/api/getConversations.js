const mongoose = require('mongoose');
const { Conversation } = require("../models/databaseSchema");
const { validationResult } = require('express-validator');

const getConversations = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0] });
  }

  const userId = new mongoose.Types.ObjectId(req.user.id);

  try {
    const result = await Conversation.aggregate([
      // Match the conversations that include the user
      { $match: { participants: userId } },
      // Exclude the user from the participants
      {
        $project: {
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

    if (result?.length > 0) {
      return res.status(200).json({ user: result });
    } else {
      return res.status(200).json({ message: 'no conversation found', user: result });
    }

    // Return the other participants' details and the number of unread messages    
  } catch (error) {
    next(error);
  }
}

module.exports = getConversations;