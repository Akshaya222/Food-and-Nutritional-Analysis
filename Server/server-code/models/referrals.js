const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  
});

const Referrals = mongoose.model('referrals', schema);
module.exports = Referrals;