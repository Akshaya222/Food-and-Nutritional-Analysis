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
    if (!feedbackID) {
      let err = new Error("Feedback ID required...");
      err.statusCode = 400;
      throw err;
    }
    await Feedbacks.updateOne({ _id: feedbackID }, { $inc: { likes: 1 } });

    successHandler(res, (data = {}), (message = "Feedback liked !!"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.dislikeFeedback = async (req, res) => {
  try {
    const feedbackID = req.body.feedbackID;
    if (!feedbackID) {
      let err = new Error("Feedback ID required...");
      err.statusCode = 400;
      throw err;
    }
    await Feedbacks.updateOne({ _id: feedbackID }, { $inc: { dislikes: 1 } });

    successHandler(res, (data = {}), (message = "Feedback disliked !!"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.listFeedbacks = async (req, res) => {
  try {
    const userID = req.query.userID;
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
