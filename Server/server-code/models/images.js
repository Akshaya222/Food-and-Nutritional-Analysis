const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  url: {
    type: String, // s3 
    required: [true, 'Image url is required...']
  },
  userID: {
    type: String,
    required: [true, 'User ID is required...']
  }
});

const Images = mongoose.model('images', schema);
module.exports = Images;