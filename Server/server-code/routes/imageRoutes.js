const express = require("express");
const router = express.Router();
const {
  addImage,
  listImages,
  addName,
  addCalories
} = require("./../controllers/images");

router.post("/add", addImage);
router.get("/list", listImages);
router.put("/name",addName);
router.put("/calories",addCalories);

module.exports = router;
