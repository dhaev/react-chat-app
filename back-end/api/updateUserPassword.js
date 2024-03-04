const validPassword = require('../config/passwordUtils').validPassword;
const genPassword = require('../config/passwordUtils').genPassword;
const { User } = require("../models/databaseSchema");
const {validationResult } = require('express-validator');


const updateUserPassword = async (req, res, next) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    // Extract fields from request body
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
  
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

  
module.exports = updateUserPassword;