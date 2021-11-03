const PricingPlans = require("../models/pricing-plans");
const { successHandler, failureHandler } = require("../utils/responseHandler");

exports.addPricingPlan = async (req, res) => {
  console.log("Add Pricing plan");
  try {
    await PricingPlans.create(req.body);
    successHandler(res, (data = {}), (message = "New pricing plan added"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.listPricingPlans = async (req, res) => {
  console.log("List Pricing plans");
  try {
    const data = await PricingPlans.find();
    successHandler(res, data, (message = "New pricing plan added"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.deletePricingPlans = async (req, res) => {
  console.log("Delete Pricing plans");
  try {
    const { planID } = req.body;
    if (!planID) {
      let err = new Error("Plan ID required...");
      err.statusCode = 400;
      throw err;
    }
    await PricingPlans.findOneAndDelete();
    successHandler(res, data, (message = "Pricing Plan deleted..."));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

exports.addCoupon = async (req, res) => {
  console.log("Add Coupon");
  try {
    const { planID, coupon } = req.body;

    if (!planID || !coupon) {
      let err = new Error("Missing input fields, planID or coupon...");
      err.statusCode = 400;
      throw err;
    }

    const data = await PricingPlans.findOneAndUpdate(
      { _id: planID },
      { $push: { couponCodes: coupon } },
      { new: true }
    );
    successHandler(res, data, (message = "New coupon added"));
  } catch (e) {
    failureHandler(res, e.message, e.statusCode);
  }
};

