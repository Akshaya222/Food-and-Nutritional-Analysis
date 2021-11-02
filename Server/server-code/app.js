const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors')

dotenv.config();
require('./db/connection');

const userRouter=require('./routes/userRoutes');
const feedbackRouter = require('./routes/feedbackRoutes');

const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use("/user",userRouter);
app.use("/feedback", feedbackRouter);

app.get("/",(req,res)=>{
    res.status(200).send({
        message:"Success"
    })
})

const port=process.env.PORT || 3002

app.listen(port,()=>{
    console.log(`Server started at port ${port}`)
})