const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userID: {
    type: String,
    required: [true, 'User ID is required...']
  },
  pricingPlanID:{
      type:String,
      required:[true,'Pricing plan ID is required...']
  },
  amount:{
      type:Number
  },
  paymenID:{
      type:String,
      required:[true,'Payment ID is required']
  },
  paymentMethodID:{
      type:String
  },
  paymentMethod:{
      type:String
  },
  cusID:{
      type:String
  },
  date:{
      type:Date,
      required:[true,'Date is required']
  }
});

const Payment = mongoose.model('payment', schema);
module.exports = Payment;