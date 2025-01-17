// Set up Multer
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid')


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      // Determine the subfolder based on file type

      let subfolder = '';
      if (file.mimetype.startsWith('image/')) {
        subfolder = 'images';
      } else if (file.mimetype.startsWith('video/')) {
        subfolder = 'videos';
      } else {
        subfolder = 'others';
      }
  
      // Create the uploads directory if it doesn't exist
      if (!fs.existsSync('uploads')) {
        fs.mkdirSync('uploads');
      }
  
      // Create the subfolder if it doesn't exist
      const dir = path.join('uploads', subfolder);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
  
      cb(null, dir);
    },
    filename: function(req, file, cb) {
      cb(null, uuid() + path.extname(file.originalname)); // append the original file extension
    }
});
  
module.exports  = multer({ storage: storage });