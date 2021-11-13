const Images = require("../models/images");
const AWS=require("aws-sdk");
const multerS3=require("multer-s3");
const multer=require('multer')
const { successHandler, failureHandler } = require("../utils/responseHandler");

const BUCKET_NAME_IMAGES="akshaya-images-new-bucket";

const s3=new AWS.S3( {
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey:process.env.AWS_SECRET_KEY,
    region:'ap-south-1'
})

var uploadImages = multer({
  storage: multerS3({
      s3: s3,
      bucket: BUCKET_NAME_IMAGES,
      acl:'public-read',
      metadata: function (req, file, cb) {
          cb(null, {fieldName: file.fieldname});
        },
      key: function (req, file, cb) {
          console.log(file);
          cb(null, file.originalname); //use Date.now() for unique file keys
      }
  })
}).single('file');

exports.addImage = async (req, res) => {
  console.log("Add Image");
  const userID=req.query.userID;
  uploadImages(req,res,async function(error){
    if(error){
        console.log(error)
        res.status(500).json({
            status:"failure",
            message:"Image uploading failed"
        })
    }
    else{
        try {
       const imageData= await Images.create({
            url:req.file.location,
            userID:userID
          });
          successHandler(res,imageData, (message = "Image added"));
        } catch (e) {
          failureHandler(res, e.message, e.statusCode);
        }
     }
})
};

exports.listImages = async (req, res) => {
  console.log('List Images',req.query.userID);
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

exports.addCalories = async (req, res) => {
  const {imageID,calories}=req.body;
  try{
    if (!imageID){
      let err = new Error('Image ID required ...');
      err.statusCode = 400;
      throw err;
    }
    const image = await Images.findById(imageID);
     if (!image){
      let err = new Error('Image not found ...');
      err.statusCode = 404;
      throw err;
    }
  const imageOut= await Images.findByIdAndUpdate(imageID,{calories:calories},{new:true})
    successHandler(res, imageOut, (message = "Your Images"));
  }catch(e){
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.addName = async (req, res) => {
  const {imageID,name}=req.body;
  try{
    if (!imageID){
      let err = new Error('Image ID required ...');
      err.statusCode = 400;
      throw err;
    }
    let image = await Images.findById(imageID);
     if (!image){
      let err = new Error('Image not found ...');
      err.statusCode = 404;
      throw err;
    }
    image = await Images.findByIdAndUpdate(imageID,{name:name},{new:true})
    successHandler(res, image, (message = "Your Images"));
  }catch(e){
    failureHandler(res, e.message, e.statusCode);
  }
};
