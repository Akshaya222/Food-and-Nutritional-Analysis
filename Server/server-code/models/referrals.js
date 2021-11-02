const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    referrerCode:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    referrerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    refferals:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        }
    ]
});

const Referrals = mongoose.model('referrals', schema);
module.exports = Referrals;