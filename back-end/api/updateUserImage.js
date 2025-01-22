const { User } = require("../models/databaseSchema");
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const updateUserImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file attached' });
  }

  const tempFilePath = req.file.path + '.tmp';
  try {

    await sharp(req.file.path)
      .resize(500, 500) // replace with your desired dimensions
      .toFile(tempFilePath);

    fs.renameSync(tempFilePath, req.file.path);

    const { userId } = req.body;

    // Get the user
    const user = await User.findOne({ _id: userId }); // replace with actual user ID
    // Delete the old image
    if (user?.image) {
      if (fs.existsSync(user?.image)) {
        fs.unlink(user?.image, (err) => {
          if (err) {
            throw err;
          }
        });
      }
    }

    // Update the user's image path
    user.image = req.file.path;

    await user.save();

    return res.status(200).json({ message: 'Image uploaded!', image: req.file.path });
  } catch (error) {
    // If an error occurred, pass it to the next middleware
    next(error);
  }
}

module.exports = updateUserImage;