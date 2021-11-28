const express = require('express');
const router = express.Router();

const {
  addNewPricingPlan,
  listPricingPlans,
  deletePricingPlans,
  addCoupon,
  activatePlan,
  applyCoupon,
  getNumberOfUsers
} = require('../controllers/pricing-plans');

router.post("/add", addNewPricingPlan);
router.get("/list", listPricingPlans);
router.delete("/delete", deletePricingPlans);
router.put("/add-coupon", addCoupon);
router.put('/activate-plan', activatePlan);
router.put('/apply-coupon', applyCoupon)

module.exports = router;