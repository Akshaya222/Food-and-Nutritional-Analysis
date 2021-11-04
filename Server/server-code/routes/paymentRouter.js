const express = require("express");
const router = express.Router();
const {
    addPayment,
    fetchPayment
} = require("../controllers/payments");

router.post("/add", addPayment);
router.get("/list",fetchPayment)

module.exports = router;
