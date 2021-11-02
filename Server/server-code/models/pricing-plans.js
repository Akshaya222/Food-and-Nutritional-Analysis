const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pricing Plan name is required...']
  },
  price: {
    type: Number,
    required: [true, 'Price is required for every new plan...']
  },
  expiryDate: {
    type: Date,
    default: Date.now() 
  },
  benefits: [String],
  description:{
    type: String
  },
  couponCodes: [{
    name: {
      type: String,
      required: [true, 'Coupon code name is required...']
    },
    amount: {
      type: Number,
      required: [true, 'Coupon code amount is required']
    },
    expiry: {
      type: Date,
      default: Date.now()
    }
  }]
});

const PricingPlans = mongoose.model('pricingplans', schema);
module.exports = PricingPlans;