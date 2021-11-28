const Recommendations=require("../models/recommendations");
const { successHandler, failureHandler } = require("../utils/responseHandler");
const fetch = require('node-fetch')
const User=require("../models/userModel");

exports.getRecommendations=async(req,res)=>{
    try{
        const items=await Recommendations.find({});
        successHandler(res,items,"fetched successfully");
    }
    catch(e){
        failureHandler(res,e.message,e.statusCode)
    }
}

exports.getFoodById=async(req,res)=>{
    let {foodId}=req.params;
    try{
        const foodItem=await Recommendations.findById(foodId);
        successHandler(res,foodItem,"fetched successfully"); 
    }
    catch(e){
        failureHandler(res,e.message,e.statusCode)
    }
}


const getFoodByName=(foodItems,recommendationFoods)=>{
        let filteredData=[]
        for(let i=0;i<recommendationFoods.length;i++){
            for(let j=0;j<foodItems.length;j++){
                if(recommendationFoods[i].name==foodItems[j]){
                    filteredData.push(recommendationFoods[i]);
                }
            }
        }
        return filteredData;
}

const callRecommendations=async(preferences)=>{
    let output=preferences.map(async(pref)=>{
    let inputData={
            "veg": pref.veg_non,
            "cuisine": pref.c_type,
            "relevance": 0,
            "Dish": pref.name
    }
    const config = {
        method: 'POST',
        body: JSON.stringify(inputData),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    try{
        let data=await fetch(`https://pacific-bayou-07515.herokuapp.com/items/`,config);
        let out=await data.json();
        let values=Object.values(out)
        return values;
    }
    catch(e){
       return e;
    }
    })
    let res=await Promise.all(output);
    const response=res.flat(1);
    return response;
}


exports.getInitialRecommendations=async(req,res)=>{
    const {userId}=req.query;
    try{
      const items=await Recommendations.find({});
      if(!userId){
        let err=new Error("UserId is required...");
        err.statusCode=400;
        throw err;
      }
      let user=await User.findById(userId);
      if(!user){
        let err=new Error("User not found");
        err.statusCode=404
        throw err;
      }
      let preferences=user.preferences
      if(preferences.length==0){
        successHandler(res,items.slice(0,10),"No preferences");
      }
      else{
          let recommended=[];
          for(let i=0;i<items.length;i++){
            for(let j=0;j<3;j++){
                if(items[i]._id==preferences[j]){
                    recommended.push(items[i]);
                }
            }
        }
        let output=await callRecommendations(recommended);
        if(output.length!=30){
        let err=new Error("Internal Error occured..");
        err.statusCode=500;
        throw err;
        }
        const getAllFoods=getFoodByName(output,items);
        successHandler(res,getAllFoods,"fetched successfully!");
      }
    }
    catch(e){
      failureHandler(res,e.message,e.statusCode)
    }
}