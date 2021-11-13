const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const UserModel = require('./../models/userModel');
const {successHandler,failureHandler}=require('../utils/responseHandler');
const {nanoid}=require('nanoid');
const AWS=require("aws-sdk");
const multerS3=require("multer-s3");
const multer=require('multer')

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode,message,req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // sameSite:"None",
    // secure:true
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    message:message,
    token,
    data: {
      user
    }
  });
};

exports.signup = async (req, res, next) => {
  let error=null;
   try{
    const {username,email,password,passwordConfirm}=req.body;
    if(!email || !username || !password || !passwordConfirm){
      error=new Error("Missing required fields");
      error.statusCode=400;
      throw error;
    }
    if(password!=passwordConfirm){
      error=new Error("passwords should match");
      error.statusCode=400;
      throw error;
    }
    const user=await UserModel.findOne({email});
    if(user){
      error=new Error("email address already exists, please do login");
      error.statusCode=400;
      throw error;
    }
    const newUser = await UserModel.create({
      name:username,
      email,
      password,
      passwordConfirm,
      code:nanoid(6)
    });
    
    if(!newUser){
      error=new Error("Some internal error occured,please try again");
      error.statusCode=500;
      throw error;
    }
    createSendToken(newUser, 201,"Registered Successfully" ,req, res);
   }
   catch(e){
     failureHandler(res,e.message,e.statusCode)
   }
}

exports.login = async (req, res, next) => {
  let error;
   try{
    const { email, password } = req.body;

    // 1) Check if email and password exist
        if (!email || !password) {
          error=new Error("please provide email and password");
          error.statusCode=400;
          throw error;
    }
    // 2) Check if user exists && password is correct
    const user = await UserModel.findOne({ email }).select('+password');
  
    if (!user || !(await user.correctPassword(password, user.password))) {
      error=new Error("Incorrect email or password");
      error.statusCode=400;
      throw error;
    }
  
    // 3) If everything ok, send token to client
    createSendToken(user, 200, "Login successfull",req, res);
   }
   catch(e){
    failureHandler(res,e.message,e.statusCode)
   }
}

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
  let error;
  try{
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
  
    if (!token) {
            error=new Error("You are not logged in! Please log in to get access");
            error.statusCode=401;
            throw error;
    }
  
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    // 3) Check if user still exists
    const currentUser = await UserModel.findById(decoded.id); if (!currentUser) {
      error=new Error("The user belonging to this token does no longer exist");
      error.statusCode=401;
      throw error;
}

 // 4) Check if user changed password after the token was issued
if (currentUser.changedPasswordAfter(decoded.iat)) {
    error=new Error("User recently changed password!Please log in again.");
    error.statusCode=401;
    throw error;
}
// GRANT ACCESS TO PROTECTED ROUTE
req.user = currentUser;
next();
}
catch(e){
failureHandler(res,e.message,e.statusCode)
}
}


exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

const BUCKET_NAME_IMAGES="akshaya-user-images";

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


exports.addPhoto=async(req,res)=>{
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
	let imageUrl=req.file.location;
        let user= await UserModel.findByIdAndUpdate(userID,{photo:imageUrl},{new:true})
          successHandler(res,user, (message = "Image added"));
        } catch (e) {
          failureHandler(res, e.message, e.statusCode);
        }
     }
})
}

exports.forgotPassword = async (req, res, next) => {
  let error;
  try {
  // 1) Get user based on POSTed email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
      error=new Error("There is no user with email address");
      error.statusCode=404;
      throw error;
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
    console.log("host is",req.get('host'))
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
    successHandler(res,null,'Token sent to email!',200)
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    failureHandler(res,e.message?e.message:"There was an error sending the email. Try again later!",e.statusCode?e.statusCode:500)
  }
};

exports.resetPassword = async (req, res, next) => {
  let error;
  try{
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    error=new Error("Token is invalid or has expired");
    error.statusCode=400;
    throw error;
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  if(!user.password || !user.passwordConfirm){
    error=new Error("missing password");
    error.statusCode=400;
    throw error;
  }
  if(user.password!=user.passwordConfirm){
    error=new Error("passwords doesn't match");
    error.statusCode=400;
    throw error;
  }
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, "passwords changed successfully",req, res);
}catch(e){
  failureHandler(res,e.message,e.statusCode)
}
}


module.exports.getUserDetails=async(req,res)=>{
  const userID=req.query.userID;
  try{
    if(!userID){
      let error=new Error("UserId is required..");
      error.statusCode=400;
      throw error;
    }
    let user=await UserModel.findById(userID);
    if(!user){
      let error=new Error("User not found");
      error.statusCode=400;
      throw error;
    }
    successHandler(res,user,"user data feched successfully");
  }
  catch(e){
    failureHandler(res,e.message,e.statusCode)
  }
}

module.exports.decreaseFreeLimits=async(req,res)=>{
  const userID=req.query.userID;
  try{
    if(!userID){
      let error=new Error("UserId is required..");
      error.statusCode=400;
      throw error;
    }
    let user=await UserModel.findById(userID);
    if(!user){
      let error=new Error("User not found");
      error.statusCode=400;
      throw error;
    }
    if(user.freeLimit>0){
      console.log("decrementing..")
      user=await UserModel.findByIdAndUpdate(userID,{ $inc: { freeLimit : -1 } },{new:true})
    }
    successHandler(res,user,"user data feched successfully");
  }
  catch(e){
    failureHandler(res,e.message,e.statusCode)
  }
}
