const { User } = require("../models/databaseSchema");
const {validationResult } = require('express-validator');


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
  
      res.status(500).json({ error: 'An error occurred while searching for user' });
    }
  }

module.exports = searchUsers;