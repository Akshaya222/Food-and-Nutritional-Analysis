const express = require('express');
const router = express.Router();

const {
  addPricingPlan,
  listPricingPlans,
  deletePricingPlans,
  addCoupon
} = require('../controllers/pricing-plans');

router.post("/add", addPricingPlan);
router.get("/list", listPricingPlans);
router.post("/delete", deletePricingPlans);
router.post("/add-coupon", addCoupon);

module.exports = router;