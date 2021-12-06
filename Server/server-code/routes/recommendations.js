const {getRecommendations,getRecByImage,getFoodById, getInitialRecommendations}=require('./../controllers/recommendations');
const router=require('express').Router();

router.get("/list",getRecommendations)
router.get("/initial/recom",getInitialRecommendations)
router.get("/rec/image",getRecByImage)
router.get("/food/:foodId",getFoodById)


module.exports=router;