const { User } = require("../models/databaseSchema");
const { validationResult } = require('express-validator');

const updateUserInfo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, uname } = req.body;
  const userId = req.user.id;

  try {
    const emailExists = await User.findOne({ email: email });
    if (emailExists && emailExists._id.toString() !== userId) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    const displayNameExists = await User.findOne({ displayName: uname });
    if (displayNameExists && displayNameExists._id.toString() !== userId) {
      return res.status(400).json({ error: "User with this name already exists" });
    }

    const updateUser = await User.findOneAndUpdate(
      { _id: userId }, // find a document with that filter
      { displayName: uname, email: email }, // document to insert when nothing was found
      { new: true }, // options

    );

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

module.exports = updateUserInfo;