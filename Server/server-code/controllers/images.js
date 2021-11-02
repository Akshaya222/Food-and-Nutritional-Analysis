const Images = require("../models/images");
const { successHandler, failureHandler } = require("../utils/responseHandler");

exports.addImage = async (req, res) => {
  console.log("Add Image");
  try {
    await Images.create(req.body);
    successHandler(res, (data = {}), (message = "Image added"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.listImages = async (req, res) => {
  console.log('List Images');
  try{
    const userID = req.query.userID;
    if (!userID){
      let err = new Error('User ID required ...');
      err.statusCode = 400;
      throw err;
    }
    const images = await Images.find({userID})
    successHandler(res, images, (message = "Your Images"));
  }catch(e){
    failureHandler(res, e.message, e.statusCode);
  }
};