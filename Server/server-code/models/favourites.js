const mongoose = require('mongoose');

const schema = new mongoose.schema({
  userID: {
    type: String,
    required: [true, 'User ID is required...']
  },
  favouriteImages: [String] // image Id
});

const Favourites = mongoose.model('favourites', schema);
module.exports = Favourites;