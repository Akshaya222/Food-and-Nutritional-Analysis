const PricingPlans = require("../models/pricing-plans");
const User = require('../models/userModel');
const { successHandler, failureHandler } = require("../utils/responseHandler");

exports.addNewPricingPlan = async (req, res) => {
  console.log("Add Pricing plan",req.body);
//const obj = Object.assign({},req.body)
//console.log(JSON.parse(JSON.stringify(req.body)))
  try {
    await PricingPlans.create(req.body);
    successHandler(res, (data = {}), (message = "New pricing plan added"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};


const getNumberOfUsers=(planID)=>{
      return new Promise(async(resolve,reject)=>{
        let users=await User.find({pricingPlan:planID});
        resolve(users.length)
      })
}

exports.listPricingPlans = async (req, res) => {
  console.log("List Pricing plans");
  try {
    const data = await PricingPlans.find();
    const plans=data.map(async(plan)=>{
      const num=await getNumberOfUsers(plan._id);
      return {
        ...plan._doc,numOfUsers:num
      }
    })
    let resolvedPlans=await Promise.all(plans);
    successHandler(res, resolvedPlans, (message = "Pricing plans fetched successfully"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.deletePricingPlans = async (req, res) => {
  try {
    const  planID  = req.query.planID;
    if (!planID) {
      let err = new Error("Plan ID required...");
      err.statusCode = 400;
      throw err;
    }
    await PricingPlans.findByIdAndDelete(planID);
    successHandler(res, {}, (message = "Pricing Plan deleted..."));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.addCoupon = async (req, res) => {
  console.log("Add Coupon");
  try {
    const { planID, coupon } = req.body;

    if (!planID || !coupon) {
      let err = new Error("Missing input fields, planID or coupon...");
      err.statusCode = 400;
      throw err;
    }

    const data = await PricingPlans.findOneAndUpdate(
      { _id: planID },
      { $push: { couponCodes: coupon } },
      { new: true }
    );
    successHandler(res, data, (message = "New coupon added"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.activatePlan = async (req, res) => {
  console.log("Activate plan");
  try {
    const {userID, planID} = req.body;

    if (!userID || !planID){
      let err = new Error('Missing input fields, userID or planID');
      err.statusCode = 400;
      throw err;
    }

    const planData = await PricingPlans.findById({_id: planID});

    if (!planData){
      let err = new Error('Invalid Plan...');
      err.statusCode = 400;
      throw err;
    }
    const currDate = new Date();
  
    if (planData['expiryDate'] < currDate){
      let err = new Error('Plan expired...');
      err.statusCode = 400;
      throw err;
    }

    const updatedUserData = await User.findByIdAndUpdate({_id: userID}, {pricingPlan: planID}, {new:true});

    successHandler(res, updatedUserData, (message = "Plan activated"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.applyCoupon = async (req, res) => {
  console.log("Apply coupon");
  try {
    const {userID, planID, couponCode} = req.body;

    if (!userID || !planID || !couponCode){
      let err = new Error('Missing input fields, userID or planID or couponCode');
      err.statusCode = 400;
      throw err;
    }

    const planData = await PricingPlans.findById({_id: planID});

    if (!planData){
      let err = new Error('Invalid Plan...');
      err.statusCode = 400;
      throw err;
    }

    const planCoupons = planData.couponCodes;
    // console.log(planCoupons, planCoupons.length);
    if (planCoupons.length === 0){
      let err = new Error('Coupon is not valid on this plan...');
      err.statusCode = 400;
      throw err;
    }

    let validCoupon = null;
    for (coupon of planCoupons){
      console.log(coupon);
      if (coupon['name'] === couponCode){
        validCoupon = coupon;
        break;
      }
    }

    if (!validCoupon){
      let err = new Error('Coupon is not valid on this plan...');
      err.statusCode = 400;
      throw err;
    }

    const currDate = new Date();
  
    if (planData['expiryDate'] < currDate || validCoupon['expiryDate'] < currDate){
      let err = new Error('Plan or coupon expired...');
      err.statusCode = 400;
      throw err;
    }    

    // planData['discount'] = validCoupon['amount'];
    // planData['price'] = planData['price'] - validCoupon['amount'];

    let data = {
      originalPrice:planData['price'],
      discount: validCoupon['amount'],
      updatedPrice: planData['price'] - validCoupon['amount']
    }

    successHandler(res, data, (message = "Coupon applied successfully..."));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

