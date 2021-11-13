const Feedbacks = require("../models/feedback");
const { successHandler, failureHandler } = require("../utils/responseHandler");

exports.addFeedback = async (req, res) => {
  console.log("Add Feedback");
  try {
    await Feedbacks.create(req.body);
    successHandler(res, (data = {}), (message = "Feedback added"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.likeFeedback = async (req, res) => {
  try {
    const feedbackID = req.body.feedbackID;
    const userID= req.body.userID;
    if (!feedbackID) {
      let err = new Error("Feedback ID required...");
      err.statusCode = 400;
      throw err;
    }
    const feedback=await Feedbacks.findById(feedbackID);
    if(!feedback){
      let err = new Error("Feedback not found...");
      err.statusCode = 404;
      throw err;
    }  
    if(!feedback.likes.users.includes(userID)){ 
      await Feedbacks.updateOne({ _id: feedbackID }, {$inc: { "likes.count": 1 },$push:{ "likes.users" : userID } } );
    }
    successHandler(res, (data = {}), (message = "Feedback liked !!"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.dislikeFeedback = async (req, res) => {
  try {
    const feedbackID = req.body.feedbackID;
    const userID= req.body.userID;
    if (!feedbackID) {
      let err = new Error("Feedback ID required...");
      err.statusCode = 400;
      throw err;
    }
    const feedback=await Feedbacks.findById(feedbackID);
    if(!feedback){
      let err = new Error("Feedback not found...");
      err.statusCode = 404;
      throw err;
    }  
    if(!feedback.dislikes.users.includes(userID)){ 
      await Feedbacks.updateOne({ _id: feedbackID }, {$inc: { "dislikes.count": 1 },$push:{ "dislikes.users" : userID } } );
    }

    successHandler(res, (data = {}), (message = "Feedback disliked !!"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.listFeedbacks = async (req, res) => {
  try {
    const userID = req.body.userID;
    if (!userID) {
      let err = new Error("User ID required...");
      err.statusCode = 400;
      throw err;
    }
    const data = await Feedbacks.find({ userID });

    successHandler(res, data, (message = "Your Feedbacks"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.allFeedbacks=async(req,res)=>{
  let err;
  try{
      let feedbacks=await Feedbacks.find({});
      successHandler(res,feedbacks, (message = "All Feedbacks"));
  }
  catch(e){
    failureHandler(res, e.message, e.statusCode);
  }
}
