const mongoose = require('mongoose');

const schema = new mongoose.schema({
  
});

const Referrals = mongoose.model('referrals', schema);
module.exports = Referrals;