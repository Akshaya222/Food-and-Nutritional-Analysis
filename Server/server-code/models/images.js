const mongoose = require('mongoose');

const schema = new mongoose.schema({
  imageID: {
    type: String,
    required: [true, 'Image ID is required...']
  },
  userID: {
    type: String,
    required: [true, 'User ID is required...']
  }
});

const Images = mongoose.model('images', schema);
module.exports = Images;