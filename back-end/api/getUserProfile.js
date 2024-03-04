const { User } = require("../models/databaseSchema");

const getUserProfile =  async (req, res, next) => {
    try { 
      // const userId = req.user.id;
      const userId = req.user.id;
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

module.exports = getUserProfile;