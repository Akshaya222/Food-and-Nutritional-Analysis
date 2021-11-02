const express = require("express");
const router = express.Router();
const {
  addImage,
  listImages
} = require("./../controllers/images");

router.post("/add", addImage);
router.get("/list", listImages);

module.exports = router;
