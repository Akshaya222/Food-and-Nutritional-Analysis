const express = require('express');
const router = express.Router();

const {
  addNewPricingPlan,
  listPricingPlans,
  deletePricingPlans,
  addCoupon,
  activatePlan,
  applyCoupon
} = require('../controllers/pricing-plans');

router.post("/add", addNewPricingPlan);
router.get("/list", listPricingPlans);
router.post("/delete", deletePricingPlans);
router.post("/add-coupon", addCoupon);
router.post('/activate-plan', activatePlan);
router.post('/apply-coupon', applyCoupon);

module.exports = router;