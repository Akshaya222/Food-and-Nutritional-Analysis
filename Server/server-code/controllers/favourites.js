const Favourites = require("../models/favourites");
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

    const isAlreadyExist = await Favourites.findOne({userID, imageID});
    if (isAlreadyExist){
      let err = new Error('Already marked as favourite...');
      err.statusCode = 400;
      throw err;
    }

    // else create new favourite for
    await Favourites.create({userID, imageID});

    successHandler(res, (data = {}), (message = "Marked favourite"));
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

    const data = await Favourites.find({userID});

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

    await Favourites.findOneAndDelete({userID, imageID});

    successHandler(res, (data = {}), (message = "Removed favourite"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

