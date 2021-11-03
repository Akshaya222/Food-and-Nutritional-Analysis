const express = require("express");
const router = express.Router();
const {
  addFavourite,
  removeFavourite,
  listFavourites
} = require("../controllers/favourites");

router.put("/add", addFavourite);
router.put("/remove", removeFavourite);
router.get("/list", listFavourites);

module.exports = router;
