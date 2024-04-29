import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "./bd/connectMongoDB.js";
import { errorHandlerMiddleware } from "./errors/errorHandler.js";
dotenv.config(); // dotenv.config() for to read .env file

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(errorHandlerMiddleware);

app.get("/", (req, res) => {
  res.send("Hello, Backend Server is working...");
});
app.use("/api/user/", authRouter);

app.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`);
  connectDB();
});
