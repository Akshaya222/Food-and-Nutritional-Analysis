const express = require('express');
const app = express();
const vision = require('@google-cloud/vision');
const multer = require('multer');
const AWS=require("aws-sdk");
const multerS3=require("multer-s3");
const dotenv=require('dotenv');
const cors=require('cors');

dotenv.config();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const BUCKET_NAME_IMAGES="akshaya-images-bucket";
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
}).single('image');
uploadImageToS3=async(req,res,next)=>{
  uploadImages(req,res,function(error){
      if(error){
          console.log(error)
          res.status(500).json({
              status:"failure",
              message:"Image uploading failed"
          })
      }
      else{
        if(!req.file.location){
          return  res.status(500).send({
              message:"File not uploaded"
            })
        }
// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: './newApiKey.json'
});

// Performs label detection on the image file
console.log("image url",req.file.location)
client
  .labelDetection(req.file.location)
  .then(results => {
    const labels = results[0].labelAnnotations;

    console.log('Labels:');
    //labels.forEach(label => console.log(label.description));
    return res.send(labels)
    //console.log(results);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
       }
  })
}
var testing=(req,res)=>{
  res.send("helloo")
}
app.post("/uploadImage",uploadImageToS3)
app.get("/check",testing)
  let port=3001

app.listen(port,() => console.log('Server running'));
