const {useRefferalCodes,useCoins}=require('./../controllers/refferals');
const router=require('express').Router();

router.post("/add",useRefferalCodes);
router.put("/use-coins",useCoins)

module.exports=router;