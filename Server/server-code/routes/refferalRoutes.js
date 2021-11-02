const {useRefferalCodes}=require('./../controllers/refferals');
const router=require('express').Router();

router.post("/add",useRefferalCodes);

module.exports=router;