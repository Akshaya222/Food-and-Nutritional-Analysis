const express = require("express");
const router = express.Router();
const {
  addFavourite,
  removeFavourite,
  listFavourites
} = require("../controllers/favourites");

router.post("/add", addFavourite);
router.post("/remove", removeFavourite);
router.get("/list", listFavourites);

module.exports = router;
