const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name:String,
  c_type:String,
  veg_non:String,
  imageUrl:String,
  description:String
});

const Recommendations = mongoose.model('recommendations', schema);
module.exports =Recommendations;