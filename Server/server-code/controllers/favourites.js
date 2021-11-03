const ImageModel=require('../models/images');
const { successHandler, failureHandler } = require("../utils/responseHandler");

exports.addFavourite = async (req, res) => {
  console.log("Add Favourite");
  try {
    const {userID, imageID} = req.body;

    if (!userID || !imageID){
      let err = new Error('Missing input fields, userID or imageID');
      err.statusCode = 400;
      throw err;
    }
    const image=await ImageModel.findById(imageID);
    if(!image){
      let err = new Error('Image not found...');
      err.statusCode = 404;
      throw err;
    }
    const updatedImage=await ImageModel.findByIdAndUpdate(imageID,{isFavorite:true},{new:true});
    if(!updatedImage){
      let err = new Error('Internal Server Error...');
      err.statusCode = 500;
      throw err;
    }
    successHandler(res,updatedImage, (message = "Marked favourite"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};


exports.listFavourites = async (req, res) => {
  console.log("List Favourites");
  try {
    const userID = req.query.userID;

    if (!userID){
      let err = new Error('Missing input field: userID ');
      err.statusCode = 400;
      throw err;
    }

    const data = await ImageModel.find({userID:userID,isFavorite:true})

    successHandler(res, data, (message = "Your favourites"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.removeFavourite = async (req, res) => {
  console.log("Remove Favourite");
  try {
    const {userID, imageID} = req.body;

    if (!userID || !imageID){
      let err = new Error('Missing input fields, userID or imageID');
      err.statusCode = 400;
      throw err;
    }
    const image=await ImageModel.findById(imageID);
    if(!image){
      let err = new Error('Image not found...');
      err.statusCode = 404;
      throw err;
    }
    const updatedImage=await ImageModel.findByIdAndUpdate(imageID,{isFavorite:false},{new:true});
    if(!updatedImage){
      let err = new Error('Internal Server Error...');
      err.statusCode = 500;
      throw err;
    }
    successHandler(res,updatedImage, (message = "Removed favourite"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

