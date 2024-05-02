import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
//Route
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
//db
import { connectDB } from "./db/connectMongoDB.js";
//Middleware
import { errorHandlerMiddleware } from "./errors/errorHandler.js";
dotenv.config(); // dotenv.config() for to read .env file

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
  cloud_name: process.env.COUDE_NAME,
  api_key: process.env.COLUDENARY_API_KEY,
  api_secret: process.env.COLUDENARY_API_SECRET,
});

app.use(errorHandlerMiddleware);

app.get("/", (req, res) => {
  res.send("Hello, Backend Server is working...");
});
app.use("/api/auth/", authRouter);
app.use("/api/user/", userRouter);

app.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`);
  connectDB();
});
