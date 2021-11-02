const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userID: {
    type: String,
    required: [true, 'User ID is required...']
  },
  message: {
    type: String
  },
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 5
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  }
});

const Feedbacks = mongoose.model('feedbacks', schema);
module.exports = Feedbacks;