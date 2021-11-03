const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userID: {
    type: String,
    required: [true, 'User ID is required...']
  },
  imageID: {
    type: String,
    required: [true, 'Favourite image required...']
  } // image Id
});

const Favourites = mongoose.model('favourites', schema);
module.exports = Favourites;