import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './Routes/userRoute.js'
import authRouter from './Routes/authRoute.js';
import listingRouter from './Routes/listingRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use(cookieParser());

mongoose.connect(process.env.MONGOURL).then(()=>{
    console.log("monogodb connected to the dtatabase!")
}).catch(()=>{
    console.log("error occured!")
});

app.listen(3000, () => {
    console.log('server is running on port 3000!');

});

// Create a __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, '/client/dist')));

// Handle all other routes with the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use('/api/user', userRouter);

app.use('/api/auth', authRouter);

app.use('/api/listing', listingRouter);

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

