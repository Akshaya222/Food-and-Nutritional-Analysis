const UserModel=require('../models/userModel');
const PricingPlans = require("../models/pricing-plans");
const { successHandler, failureHandler } = require("../utils/responseHandler");

module.exports.useRefferalCodes=async(req,res)=>{
    const {code,userId}=req.body;
    let error;
    try{
        if(!code || !userId){
            error=new Error("Missing required fields");
            error.statusCode=400;
            throw error;
        }
        let refferer=await UserModel.findOne({code});
        let user=await UserModel.findById(userId);
        if(!user){
            error=new Error("User not found");
            error.statusCode=404;
            throw error;
        }
        if(!refferer){
            error=new Error("Referral code is not valid!");
            error.statusCode=400;
            throw error;
        }
       let updatedUser=await UserModel.findByIdAndUpdate(userId,{coins:user.coins+10,referrerCode:code,
        referrerId:refferer._id},{new:true})
       let refferals=refferer.refferals;
       refferals.push(userId)
       let updatedRefferer=await  UserModel.findByIdAndUpdate(refferer._id,{refferals:refferals,coins:refferer.coins+20},{new:true})
       if(!updatedUser || !updatedRefferer ){
        error=new Error("Internal Error Occured");
        error.statusCode=500;
        throw error;   
       }
       let data={
           user:updatedUser,
           refferer:updatedRefferer
       }
       successHandler(res,data,"Successful Operation",200)
    }
    catch(e){
        failureHandler(res,e.message,e.statusCode)
    }
}

exports.useCoins = async (req, res) => {
    try {
      const {userID, planID} = req.body;
      if (!userID || !planID){
        let err = new Error('Missing input fields, userID or planID or couponCode');
        err.statusCode = 400;
        throw err;
      }
  
      const planData = await PricingPlans.findById(planID);
      const user=await UserModel.findById(userID)
  
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
      await UserModel.findByIdAndUpdate(userID,{coins:0})
      let data = {
        updatedPrice: planData['price'] - user.coins
      }
      successHandler(res, data, (message = "Coins applied successfully..."));
    } catch (e) {
      failureHandler(res, e.message, e.statusCode);
    }
  };
  
