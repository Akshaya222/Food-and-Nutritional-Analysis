const express = require("express");
const router = express.Router();
const {
  addFeedback,
  likeFeedback,
  dislikeFeedback,
  listFeedbacks,
} = require("./../controllers/feedback");

router.post("/add", addFeedback);
router.put("/like", likeFeedback);
router.put('/dislike', dislikeFeedback);
router.get('/list', listFeedbacks);

module.exports = router;
