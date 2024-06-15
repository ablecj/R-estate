import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './Routes/userRoute.js'
import authRouter from './Routes/authRoute.js'

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGOURL).then(()=>{
    console.log("monogodb connected to the dtatabase!")
}).catch(()=>{
    console.log("error occured!")
})

app.listen(3000, () => {
    console.log('server is running on port 3000!');

});


app.use('/api/user', userRouter);

app.use('/api/auth', authRouter);

// middleware for calling error 
app.use((err,req,res,next)=> {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

