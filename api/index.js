import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './Routes/userRoute.js';
import authRouter from './Routes/authRoute.js';
import listingRouter from './Routes/listingRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // ✅ Fix __dirname issue

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process if connection fails
  });

// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ API Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// ✅ Serve Frontend (Vite React Build)
app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(`❌ Error: ${message}`);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Dynamic PORT for Render Deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
