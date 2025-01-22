const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_STRING, {
      autoIndex: true
    });
  } catch (error) {

  }
};

// Call the function to connect to the database
module.exports = connectToDB

