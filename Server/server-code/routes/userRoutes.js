const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.put("/image",authController.addPhoto);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.get("/me",authController.getUserDetails);
router.get("/dec-limits",authController.decreaseFreeLimits);
router.get("/all-users",authController.getAllInfoForAdmin);
router.put("/preferences",authController.savePreferences)

// Protect all routes after this middleware
router.use(authController.protect);

router.use(authController.restrictTo('admin'));
// admin related routes

module.exports = router;
