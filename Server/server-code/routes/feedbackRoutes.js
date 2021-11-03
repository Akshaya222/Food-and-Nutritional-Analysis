const express = require("express");
const router = express.Router();
const {
  addFeedback,
  likeFeedback,
  dislikeFeedback,
  listFeedbacks,
  allFeedbacks
} = require("./../controllers/feedback");

router.post("/add", addFeedback);
router.put("/like", likeFeedback);
router.put('/dislike', dislikeFeedback);
router.get('/list', listFeedbacks);
router.get("/all",allFeedbacks)

module.exports = router;
